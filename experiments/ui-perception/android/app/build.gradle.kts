import java.security.MessageDigest
plugins { id("com.android.application") }
android {
    namespace = "org.pueblo98.granny.perceptionlab"
    compileSdk = 36
    defaultConfig {
        applicationId = "org.pueblo98.granny.perceptionlab"
        minSdk = 34
        targetSdk = 36
        versionCode = 4
        versionName = "0.4-offline-ocr"
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    sourceSets.getByName("main").assets.srcDir("build/generated/ocrAssets")
}
dependencies {
    implementation("cz.adaptech.tesseract4android:tesseract4android:4.9.0")
    testImplementation("junit:junit:4.13.2")
}
val modelFile = layout.buildDirectory.file("generated/ocrAssets/tessdata/eng.traineddata")
val verifyOcrModel by tasks.registering {
    inputs.file(modelFile)
    doLast {
        val bytes = inputs.files.singleFile.readBytes()
        val digest = MessageDigest.getInstance("SHA-256").digest(bytes).joinToString("") { "%02x".format(it) }
        check(digest == "7d4322bd2a7749724879683fc3912cb542f19906c83bcc1a52132556427170b2") { "Run prepare_model.py; missing or incorrect English model" }
    }
}
tasks.named("preBuild").configure { dependsOn(verifyOcrModel) }
