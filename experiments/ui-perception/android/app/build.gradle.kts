plugins { id("com.android.application") }
android {
    namespace = "org.pueblo98.granny.perceptionlab"
    compileSdk = 36
    defaultConfig {
        applicationId = "org.pueblo98.granny.perceptionlab"
        minSdk = 34
        targetSdk = 36
        versionCode = 1
        versionName = "0.1-read-only-lab"
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
dependencies { testImplementation("junit:junit:4.13.2") }
