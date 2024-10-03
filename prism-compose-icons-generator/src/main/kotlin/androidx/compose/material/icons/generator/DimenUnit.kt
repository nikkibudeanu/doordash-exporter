package androidx.compose.material.icons.generator

import com.squareup.kotlinpoet.MemberName

sealed class DimenUnit {
    abstract val value: Float
    abstract val memberName: MemberName?

    class Px(override val value: Float) : DimenUnit() {
        override val memberName: MemberName? = null
    }

    class Dp(override val value: Float) : DimenUnit() {
        override val memberName: MemberName? = MemberNames.Dp
    }
}

fun String.toUnit(): DimenUnit {
    val isStrokeDp = endsWith("dp")
    return when {
        isStrokeDp -> DimenUnit.Dp(removeSuffix("dp").toFloat())
        else -> DimenUnit.Px(toFloat())
    }
}