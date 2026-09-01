import gulp from "gulp";
import browsersync from "browser-sync";
import nunjucksRender from "gulp-nunjucks-render";
import * as sass from "sass";
import gulpSass from "gulp-sass";
import postcss from "gulp-postcss";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer";
import esbuild from "gulp-esbuild";
import sourcemaps from "gulp-sourcemaps";
import imagemin from "gulp-imagemin";
import mozjpeg from "imagemin-mozjpeg";
import pngquant from "imagemin-pngquant";
import { deleteSync } from "del";
import rename from "gulp-rename";
import replace from "gulp-replace";
import prettier from "gulp-prettier";
import htmlValidator from "html-validator";
import fg from "fast-glob";
import fs from "fs";
import path from "path";

const sassCompiler = gulpSass(sass);
const bs = browsersync.create();

const paths = {
    html: "src/pages/**/*.njk",
    templates: "src",
    styles: "src/scss/index.scss",
    componentStyles: ["src/blocks/**/*.scss", "src/components/**/*.scss", "src/scss/core/*.scss"],
    js: "src/js/index.js",
    componentJS: ["src/blocks/**/*.js", "src/components/**/*.js", "src/js/core/*.js"],
    assets: "src/assets/**/*",
    devDist: "temp",
    prodDist: "build"
};

// Clean temp/ and build/ directories
export const clean = (done) => {
    deleteSync([paths.devDist, paths.prodDist]);
    done();
};

// HTML compilation for development (outputs to temp/)
export const html = () =>
    gulp
        .src(paths.html)
        .pipe(
            nunjucksRender({ path: [paths.templates] }).on("error", function (err) {
                console.error("Nunjucks error:", err.message);
                this.emit("end");
            })
        )
        .pipe(gulp.dest(paths.devDist))
        .pipe(bs.stream());

// HTML compilation for production (outputs to build/)
export const htmlProd = () =>
    gulp
        .src(paths.html)
        .pipe(
            nunjucksRender({ path: [paths.templates] }).on("error", (err) => {
                console.error("Nunjucks error:", err.message);
                throw err;
            })
        )
        .pipe(replace("bundle.css", "bundle.min.css"))
        .pipe(replace("bundle.js", "bundle.min.js"))
        .pipe(prettier({ parser: "html" }))
        .pipe(gulp.dest(paths.prodDist));

// Styles compilation for development (outputs to temp/css/bundle.css with sourcemaps)
export const styles = () =>
    gulp
        .src(paths.styles)
        .pipe(sourcemaps.init())
        .pipe(
            sassCompiler({
                includePaths: ["src/blocks", "src/components", "src/scss/core"]
            }).on("error", sassCompiler.logError)
        )
        .pipe(rename("bundle.css"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(`${paths.devDist}/css`))
        .pipe(bs.stream());

// Styles compilation for production (outputs to build/css/bundle.min.css without sourcemaps)
export const stylesProd = () =>
    gulp
        .src(paths.styles)
        .pipe(
            sassCompiler({
                includePaths: ["src/blocks", "src/components", "src/scss/core"]
            }).on("error", (err) => {
                console.error("SCSS compilation error:", err.message);
                throw err;
            })
        )
        .pipe(postcss([autoprefixer(), cssnano({ preset: "default" })]))
        .pipe(rename("bundle.min.css"))
        .pipe(gulp.dest(`${paths.prodDist}/css`));

// Scripts compilation for development (outputs to temp/js/bundle.js with sourcemaps, no minification)
export const scripts = () =>
    gulp
        .src(paths.js, { allowEmpty: true })
        .pipe(sourcemaps.init())
        .pipe(
            esbuild({
                outfile: "bundle.js",
                bundle: true,
                format: "iife",
                platform: "browser",
                minify: false,
                sourcemap: true
            }).on("error", function (err) {
                console.error("esbuild error:", err);
                this.emit("end");
            })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(`${paths.devDist}/js`))
        .pipe(bs.stream());

// Scripts compilation for production (outputs to build/js/bundle.min.js without sourcemaps, minified)
export const scriptsProd = () =>
    gulp
        .src(paths.js, { allowEmpty: true })
        .pipe(
            esbuild({
                outfile: "bundle.min.js",
                bundle: true,
                format: "iife",
                platform: "browser",
                minify: true,
                sourcemap: false,
                legalComments: "none"
            }).on("error", (err) => {
                console.error("esbuild error:", err);
                throw err;
            })
        )
        .pipe(gulp.dest(`${paths.prodDist}/js`));

// Copy assets for development
export const assets = () => gulp.src(paths.assets, { encoding: false }).pipe(gulp.dest(`${paths.devDist}/assets`));

// Copy and optimize assets for production
export const assetsProd = () =>
    gulp
        .src(paths.assets, { encoding: false })
        .pipe(
            imagemin([mozjpeg({ quality: 75, progressive: true }), pngquant({ quality: [0.6, 0.8] })]).on(
                "error",
                (err) => {
                    console.error("Image optimization error:", err.message);
                    throw err;
                }
            )
        )
        .pipe(gulp.dest(`${paths.prodDist}/assets`));

// Manual compression of source images (replaces originals!)
export const compressImages = () => {
    console.log("\nWARNING: This command will replace original images with compressed versions!\n");

    return gulp
        .src("src/assets/images/**/*.{jpg,jpeg,png}", { encoding: false })
        .pipe(imagemin([mozjpeg({ quality: 85, progressive: true }), pngquant({ quality: [0.7, 0.9] })]))
        .pipe(gulp.dest("src/assets/images"));
};

// Analyze JavaScript bundle size
export const analyzeBundle = () =>
    gulp
        .src(paths.js, { allowEmpty: true })
        .pipe(
            esbuild({
                outfile: "bundle.min.js",
                bundle: true,
                format: "iife",
                platform: "browser",
                minify: true,
                metafile: true
            }).on("error", (err) => {
                console.error("esbuild error:", err);
            })
        )
        .on("data", (file) => {
            // Show size only for JS bundle, skip metafile
            if (file.path.endsWith(".js")) {
                const sizeBytes = file.contents.length;
                const sizeKB = (sizeBytes / 1024).toFixed(2);
                console.log(`\nBundle size: ${sizeKB} KB (${sizeBytes} bytes)\n`);
            }
        });

// HTML validation via W3C validator
export const validateHtml = async () => {
    const htmlFiles = await fg(`${paths.prodDist}/**/*.html`);

    if (htmlFiles.length === 0) {
        console.log("\nNo HTML files found in build/ directory. Run 'npm run build' first.\n");
        return;
    }

    console.log(`\nValidating ${htmlFiles.length} HTML file(s)...\n`);

    let totalErrors = 0;

    for (const file of htmlFiles) {
        const html = fs.readFileSync(file, "utf8");
        const fileName = path.relative(paths.prodDist, file);

        try {
            const result = await htmlValidator({
                data: html,
                format: "json"
            });

            const messages = result.messages || [];
            const errors = messages.filter((msg) => msg.type === "error");

            if (errors.length > 0) {
                console.log(`\n${fileName}`);
                console.log(`  Errors: ${errors.length}`);
                errors.forEach((err) => {
                    console.log(`     Line ${err.lastLine}: ${err.message}`);
                });
                totalErrors += errors.length;
            } else {
                console.log(`[PASS] ${fileName}`);
            }
        } catch (error) {
            console.error(`\n[ERROR] Validation failed for ${fileName}:`, error.message);
        }
    }

    console.log(`\nTotal: ${totalErrors} error(s)\n`);
};

// Development server (uses temp/)
export const serve = () => {
    bs.init({
        server: {
            baseDir: paths.devDist
        },
        port: 3000,
        notify: false,
        open: true,
        cors: true,
        reloadOnRestart: true
    });

    gulp.watch(["src/**/*.njk"], html);
    gulp.watch(["src/**/*.scss"], styles);
    gulp.watch(["src/**/*.js"], scripts);
    gulp.watch(["src/assets/**/*.*"], assets);
};

// Development task
export const dev = gulp.series(clean, gulp.parallel(html, styles, scripts, assets));

// Production build task
export const build = gulp.series(clean, gulp.parallel(htmlProd, stylesProd, scriptsProd, assetsProd));

// Default task
export default gulp.series(dev, serve);
