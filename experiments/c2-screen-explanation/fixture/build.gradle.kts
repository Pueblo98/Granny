plugins {
    id("com.android.application")
}

android {
    namespace = "org.pueblo98.granny.c2fixture"
    compileSdk = 36

    defaultConfig {
        applicationId = "org.pueblo98.granny.c2fixture"
        minSdk = 36
        targetSdk = 36
        versionCode = 1
        versionName = "0.1-scaffold"
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
}
