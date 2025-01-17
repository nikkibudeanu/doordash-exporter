/*
 * Copyright 2020 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package androidx.compose.material.icons.generator

import androidx.compose.material.icons.generator.vector.*
import org.xmlpull.v1.XmlPullParser
import org.xmlpull.v1.XmlPullParser.END_DOCUMENT
import org.xmlpull.v1.XmlPullParser.END_TAG
import org.xmlpull.v1.XmlPullParser.START_TAG
import org.xmlpull.v1.XmlPullParserException
import org.xmlpull.v1.XmlPullParserFactory

/**
 * Parser that converts [icon]s into [Vector]s
 */
class IconParser(private val icon: Icon) {

    /**
     * @return a [Vector] representing the provided [icon].
     */
    fun parse(): Vector {
        val parser = XmlPullParserFactory.newInstance().newPullParser().apply {
            setInput(icon.fileContent.byteInputStream(), null)
            seekToStartTag()
        }

        check(parser.name == "vector") { "The start tag must be <vector>!" }

        parser.next()

        val nodes = mutableListOf<VectorNode>()

        var currentGroup: VectorNode.Group? = null

        while (!parser.isAtEnd()) {
            when (parser.eventType) {
                START_TAG -> {
                    when (parser.name) {
                        PATH -> {
                            val pathData = parser.getAttributeValue(
                                null,
                                PATH_DATA
                            )
                            val fillAlpha = parser.getValueAsFloat(FILL_ALPHA)
                            val strokeAlpha = parser.getValueAsFloat(STROKE_ALPHA)
                            val fillType = when (parser.getAttributeValue(null, FILL_TYPE)) {
                                // evenOdd and nonZero are the only supported values here, where
                                // nonZero is the default if no values are defined.
                                EVEN_ODD -> FillType.EvenOdd
                                else -> FillType.NonZero
                            }

                            // region [Prism] Support stroke features
                            val strokeCap = parser.getAttributeValue(null, STROKE_LINE_CAP)
                                ?.let { StrokeCap.values().find { strokeCap -> strokeCap.name.equals(it, ignoreCase = true) } }
                            val strokeWidth = (parser.getAttributeValue(null, STROKE_WIDTH) ?: "0").toUnit()

                            val strokeColor = parser.getAttributeValue(null, STROKE_COLOR)
                                ?.toHexColor()

                            val fillColor = parser.getAttributeValue(null, FILL_COLOR)
                                ?.toHexColor()

                            val fill = when {
                                fillColor != null -> Fill.Color(fillColor)
                                else -> null
                            }
                            // endregion

                            val path = VectorNode.Path(
                                // region [Prism] Support gradient
                                fill = fill,
                                // endregion
                                // region [Prism] Support path fill color and stroke
                                strokeColorHex = strokeColor,
                                strokeLineWidth = strokeWidth,
                                strokeLineCap = strokeCap,
                                fillColor = fillColor,
                                // endregion
                                strokeAlpha = strokeAlpha ?: 1f,
                                fillAlpha = fillAlpha ?: 1f,
                                fillType = fillType,
                                nodes = PathParser.parsePathString(pathData)
                            )
                            if (currentGroup != null) {
                                currentGroup.paths.add(path)
                            } else {
                                nodes.add(path)
                            }
                        }
                        // Material icons are simple and don't have nested groups, so this can be simple
                        GROUP -> {
                            val group = VectorNode.Group()
                            currentGroup = group
                            nodes.add(group)
                        }
                        CLIP_PATH -> { /* TODO: b/147418351 - parse clipping paths */
                        }
                        GRADIENT -> {
                            val gradient = when (parser.getAttributeValue(null, TYPE)) {
                                TYPE_LINEAR -> {
                                    val startX = parser.getValueAsFloat(START_X) ?: 0f
                                    val startY = parser.getValueAsFloat(START_Y) ?: 0f
                                    val endX = parser.getValueAsFloat(END_X) ?: 0f
                                    val endY = parser.getValueAsFloat(END_Y) ?: 0f
                                    Fill.LinearGradient(
                                        startY = startY,
                                        startX = startX,
                                        endX = endX,
                                        endY = endY
                                    )
                                }
                                TYPE_RADIAL -> {
                                    val gradientRadius = parser.getValueAsFloat(GRADIENT_RADIUS) ?: 0f
                                    val centerX = parser.getValueAsFloat(CENTER_X) ?: 0f
                                    val centerY = parser.getValueAsFloat(CENTER_Y) ?: 0f
                                    Fill.RadialGradient(
                                        gradientRadius = gradientRadius,
                                        centerX = centerX,
                                        centerY = centerY
                                    )
                                }
                                else -> null
                            }

                            val lastPath = currentGroup?.paths?.removeLast() ?: nodes.removeLast()
                            if (lastPath as? VectorNode.Path != null && lastPath.fill == null) {
                                val gradientPath = lastPath.copy(fill = gradient)
                                if (currentGroup != null) {
                                    currentGroup.paths.add(gradientPath)
                                } else {
                                    nodes.add(gradientPath)
                                }
                            }
                        }
                        ITEM -> {
                            val offset = parser.getValueAsFloat(OFFSET) ?: 0f
                            val colorHex = parser.getAttributeValue(null, COLOR).toHexColor()

                            val colorStop = ColorStop(offset, colorHex)
                            val lastPath = (currentGroup?.paths?.last() ?: nodes.last()) as? VectorNode.Path
                            when (lastPath?.fill) {
                                is Fill.LinearGradient -> lastPath.fill.colorStops.add(colorStop)
                                is Fill.RadialGradient -> lastPath.fill.colorStops.add(colorStop)
                                else -> {}
                            }
                        }
                    }
                }
            }
            parser.next()
        }

        return Vector(nodes)
    }
}

/**
 * @return the float value for the attribute [name], or null if it couldn't be found
 */
private fun XmlPullParser.getValueAsFloat(name: String) =
    getAttributeValue(null, name)?.toFloatOrNull()

private fun XmlPullParser.seekToStartTag(): XmlPullParser {
    var type = next()
    while (type != START_TAG && type != END_DOCUMENT) {
        // Empty loop
        type = next()
    }
    if (type != START_TAG) {
        throw XmlPullParserException("No start tag found")
    }
    return this
}

private fun XmlPullParser.isAtEnd() =
    eventType == END_DOCUMENT || (depth < 1 && eventType == END_TAG)

// region [Prism] Support path fill color
private const val HexCharacters = "[0-9a-fA-F]"
private val hexRegex = "^$HexCharacters{3,8}".toRegex()

private fun String.toHexColor(): String {
    return removePrefix("#")
        .let {
            if (hexRegex.matches(it)) {
                if (it.length == 3) {
                    it.replace(
                        Regex("($HexCharacters)($HexCharacters)($HexCharacters)"),
                        "FF$1$1$2$2$3$3"
                    )
                } else if (it.length > 6) {
                    it
                } else "FF$it"
            } else {
                "FF000000"
            }
        }
}
// endregion

// XML tag names
private const val CLIP_PATH = "clip-path"
private const val GROUP = "group"
private const val PATH = "path"
// region [Prism] Support gradient
private const val GRADIENT = "gradient"
private const val ITEM = "item"
// endregion

// XML attribute names
private const val PATH_DATA = "android:pathData"
private const val FILL_ALPHA = "android:fillAlpha"
private const val STROKE_ALPHA = "android:strokeAlpha"
private const val FILL_TYPE = "android:fillType"
// region [Prism] Support stroke features
private const val STROKE_LINE_CAP = "android:strokeLineCap"
private const val STROKE_WIDTH = "android:strokeWidth"
private const val STROKE_COLOR = "android:strokeColor"
private const val FILL_COLOR = "android:fillColor"
// endregion
// region [Prism] Support gradient
private const val TYPE = "android:type"
private const val START_Y = "android:startY"
private const val START_X = "android:startX"
private const val END_Y = "android:endY"
private const val END_X = "android:endX"
private const val GRADIENT_RADIUS = "android:gradientRadius"
private const val CENTER_X = "android:centerX"
private const val CENTER_Y = "android:centerY"
private const val OFFSET = "android:offset"
private const val COLOR = "android:color"
private const val TYPE_LINEAR = "linear"
private const val TYPE_RADIAL = "radial"
// endregion

// XML attribute values
private const val EVEN_ODD = "evenOdd"