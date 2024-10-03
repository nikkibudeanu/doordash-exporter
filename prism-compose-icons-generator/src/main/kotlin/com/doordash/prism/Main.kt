package com.doordash.prism

import androidx.compose.material.icons.generator.IconProcessor
import androidx.compose.material.icons.generator.IconTestingManifestGenerator
import androidx.compose.material.icons.generator.IconWriter
import java.io.File

fun main(args: Array<String>) {
    if (args.size != 2) {
        throw IllegalArgumentException("Must provide two arguments, first is the input directory, " +
                "second is the output directory.")
    }

    val inputFolder = args[0]
    val outputFolder = args[1]

    println("Input: $inputFolder  Output: $outputFolder")

    val icons = IconProcessor(
        iconDirectories = listOf(
            File("$inputFolder/regular"),
            File("$inputFolder/fill"),
            File("$inputFolder/line"),
            File("$inputFolder/logo"),
            File("$inputFolder/logo.color"),
            File("$inputFolder/logo.mono"),
        ),
        expectedApiFile = File(""),
        generatedApiFile = File(""),
        verifyApi = false
    ).process()

    val writer = IconWriter(icons)
    writer.generateTo(File(outputFolder)) {
        true
    }

    // Output icons data for demo app
    val manifestGenerator = IconTestingManifestGenerator(icons)
    manifestGenerator.generateTo(File(outputFolder))
}