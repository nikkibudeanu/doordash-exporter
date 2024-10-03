import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "1.6.21"
    application
}

group = "com.doordash.prism"
version = "1.3"

repositories {
    mavenCentral()
    maven("https://maven.google.com")
    maven("https://jetbrains.bintray.com/trove4j")
}

dependencies {
    implementation("com.google.guava:guava:23.0")
    implementation("com.android.tools:sdk-common:27.2.0-alpha16")
    implementation("com.android.tools:common:27.2.0-alpha16")
    implementation("com.squareup:kotlinpoet:1.12.0")
    implementation("xmlpull:xmlpull:1.1.3.1")
    implementation("org.ogce:xpp3:1.1.6")
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = "1.8"
}

application {
    mainClass.set("com.doordash.prism.MainKt")
}

tasks {
    val assembleFatJar = register<Jar>("assembleFatJar") {
        dependsOn.addAll(listOf("compileJava", "compileKotlin", "processResources"))
        archiveClassifier.set("standalone") // Suffix to the jar name
        duplicatesStrategy = DuplicatesStrategy.EXCLUDE
        manifest { attributes(mapOf("Main-Class" to application.mainClass)) }
        val sourcesMain = sourceSets.main.get()
        val contents = configurations.runtimeClasspath.get()
            .map { if (it.isDirectory) it else zipTree(it) } + sourcesMain.output
        from(contents)
    }
    build {
        dependsOn(assembleFatJar) // Trigger fat jar creation during build
    }
}

tasks.withType<org.gradle.jvm.tasks.Jar>() {
    exclude("META-INF/*.RSA", "META-INF/*.SF", "META-INF/*.DSA")
}