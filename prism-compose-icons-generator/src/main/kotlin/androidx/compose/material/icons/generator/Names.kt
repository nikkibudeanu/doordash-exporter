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

import com.squareup.kotlinpoet.ClassName
import com.squareup.kotlinpoet.MemberName

/**
 * Package names used for icon generation.
 */
enum class PackageNames(val packageName: String) {
    MaterialIconsPackage("androidx.compose.material.icons"),
    GraphicsPackage("androidx.compose.ui.graphics"),
    VectorPackage(GraphicsPackage.packageName + ".vector"),
    // region [Prism] Add Prism package names
    PrismIconsPackage("com.doordash.android.prism.compose.foundation.icons"),
    PrismDemoPackage("com.doordash.android.prism.compose.demo.icons.data"),
    UnitPackage("androidx.compose.ui.unit"),
    // endregion
    // region [Prism] Support gradient
    GeometryPackage("androidx.compose.ui.geometry"),
    // endregion
}

/**
 * [ClassName]s used for icon generation.
 */
object ClassNames {
    val Icons = PackageNames.PrismIconsPackage.className("Icons")
    val ImageVector = PackageNames.VectorPackage.className("ImageVector")
    val PathFillType = PackageNames.GraphicsPackage.className("PathFillType", "Companion")
    // region [Prism] Add Prism class names
    val StrokeCap = PackageNames.GraphicsPackage.className("StrokeCap", "Companion")
    // endregion
    // region [Prism] Support gradient
    val Brush = PackageNames.GraphicsPackage.className("Brush", "Companion")
    // endregion
}

/**
 * [MemberName]s used for icon generation.
 */
object MemberNames {
    val MaterialIcon = MemberName(PackageNames.MaterialIconsPackage.packageName, "materialIcon")
    val MaterialPath = MemberName(PackageNames.MaterialIconsPackage.packageName, "materialPath")

    val EvenOdd = MemberName(ClassNames.PathFillType, "EvenOdd")
    val Group = MemberName(PackageNames.VectorPackage.packageName, "group")

    // region [Prism] Add Prism member names
    val PrismIcon = MemberName(PackageNames.PrismIconsPackage.packageName, "prismIcon")
    val PrismPath = MemberName(PackageNames.PrismIconsPackage.packageName, "prismPath")

    val StrokeCapButt = MemberName(ClassNames.StrokeCap, "Butt")
    val StrokeCapRound = MemberName(ClassNames.StrokeCap, "Round")
    val StrokeCapSquare = MemberName(ClassNames.StrokeCap, "Square")

    val Color = MemberName(PackageNames.GraphicsPackage.packageName, "Color")
    val SolidColor = MemberName(PackageNames.GraphicsPackage.packageName, "SolidColor")

    val Dp = MemberName(PackageNames.UnitPackage.packageName, "dp")
    // endregion
    // region [Prism] Support gradient
    val LinearGradient = MemberName(ClassNames.Brush, "linearGradient")
    val RadialGradient = MemberName(ClassNames.Brush, "radialGradient")

    val Offset = MemberName(PackageNames.GeometryPackage.packageName, "Offset")
    // endregion
}

/**
 * @return the [ClassName] of the given [classNames] inside this package.
 */
fun PackageNames.className(vararg classNames: String) = ClassName(this.packageName, *classNames)