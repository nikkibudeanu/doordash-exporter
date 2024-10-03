# Prism icons generator for Jetpack Compose

This is a modified version of the [Material Compose icons generator](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/material/material/icons/) from the AOSP. It converts VectorDrawable in xml to ImageVector in Kotlin. This is used by the [design-language](https://github.com/doordash/design-language) repo to support icons generation for Jetpack Compose. 

Changes that are made locally are bounded within code folding comments `// region [Prism] ...` and `// endregion`. In case we need to bringing updated changes from the original repo, the code folding comments helps us identify our additional changes which could be useful when resolving code conflicts.

## Usage

Execute the jar and provide two arguments which are the input directory of the VectorDrawable xml files and output directory for the Kotlin ImageVector files.

```shell
$ java -jar prism-compose-icons-generator-1.0-standalone.jar [XML INPUT DIR] [KOTLIN OUTPUT DIR]

# e.g.
$ java -jar prism-compose-icons-generator-1.0-standalone.jar res/drawable generated/compose/icons
```

## Build

1. In the terminal, run `./gradlew clean build`
2. Locate the `build/libs` directory
3. The `prism-compose-icons-generator-1.0.jar` contains only classes within this project.
4. The `prism-compose-icons-generator-1.0-standalone.jar` contains also the dependencies consumed by this project.
5. When consuming in [design-language](https://github.com/doordash/design-language), copy the `prism-compose-icons-generator-1.0-standalone.jar`
6. Paste the jar into `design-language/libs`