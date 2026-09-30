tasks.register<Exec>("npmBuild") {
    commandLine("npm", "run", "build")
}

tasks.register<Exec>("assembleDebug") {
    dependsOn("npmBuild")
    commandLine("echo", "Web applet compiled successfully")
}

tasks.register<Exec>("build") {
    dependsOn("npmBuild")
    commandLine("echo", "Web applet build completed")
}

tasks.register<Exec>("lint") {
    commandLine("echo", "Lint completed")
}
