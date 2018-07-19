### Release checks
This is an automated testing tool for projects that were generated by the Aurelia-CLI. It tests all "au" commands for every project.

### How to run
1. open the terminal, go into an empty directory and run `au generate-skeletons`
2. from the CLI repository folder, run `gulp release-check --path C:/Development/Aurelia/TestApps --latest-cli-url https://github.com/aurelia/cli.git#master`, substituting the path with the correct one
3. Select for which projects you would like to run the tests
4. Wait until tests complete
5. in the CLI repository folder there is now a release-checks-results folder containing the output and other artifacts, such as screenshots. Check these screenshots to make sure that pages have rendered correctly

### Add new tests
In the build/tasks/release-checks folder is a test-suites.js file. This file contains a collection of tests per project. New tests can be added to this file.

### Todo
- Tests for dotnet projects (the tool can run dotnet new, but dotnet does not serve the index.html file that exists in wwwrooot)