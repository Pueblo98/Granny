plugins { id("com.android.application") }
android {
    namespace = "org.pueblo98.granny.perceptionlab"
    compileSdk = 36
    defaultConfig {
        applicationId = "org.pueblo98.granny.perceptionlab"
        minSdk = 34
        targetSdk = 36
        versionCode = 3
        versionName = "0.3-fresh-semantics"
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
dependencies { testImplementation("junit:junit:4.13.2") }
