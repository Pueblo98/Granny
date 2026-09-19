plugins {
    id("com.android.application")
}

android {
    namespace = "org.pueblo98.stage1"
    compileSdk = 36

    defaultConfig {
        applicationId = "org.pueblo98.stage1"
        minSdk = 31
        targetSdk = 36
        versionCode = 1
        versionName = "0.1-t120"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    lint {
        abortOnError = true
        warningsAsErrors = false
    }
}

dependencies {
    testImplementation("junit:junit:4.13.2")
}
