using System.Xml.Linq;

namespace MemberProfile.Backend.Tests;

[TestClass]
public sealed class FoundationBoundaryTests
{
    [TestMethod]
    public void BackendTargetsNet11()
    {
        var targetFramework = LoadBackendProject()
            .Descendants("TargetFramework")
            .SingleOrDefault();

        Assert.IsNotNull(targetFramework);
        Assert.AreEqual("net11.0", targetFramework.Value);
    }

    [TestMethod]
    public void BackendHasNoExternalRuntimeOrPackageReferences()
    {
        var project = LoadBackendProject();

        Assert.AreEqual(0, project.Descendants("ProjectReference").Count());
        Assert.AreEqual(0, project.Descendants("PackageReference").Count());
    }

    [TestMethod]
    public void BackendTestProjectIsExternalAndReferencesOnlyTheBackend()
    {
        var repositoryRoot = FindRepositoryRoot();
        var backendDirectory = Path.Combine(repositoryRoot, "src", "backend");
        var testProjectPath = Path.Combine(
            repositoryRoot,
            "tests",
            "unit",
            "backend",
            "MemberProfile.Backend.Tests.csproj");

        Assert.IsFalse(
            Path.GetFullPath(testProjectPath).StartsWith(
                Path.TrimEndingDirectorySeparator(Path.GetFullPath(backendDirectory))
                    + Path.DirectorySeparatorChar,
                StringComparison.OrdinalIgnoreCase));

        var references = XDocument.Load(testProjectPath)
            .Descendants("ProjectReference")
            .Select(reference => (string?)reference.Attribute("Include"))
            .ToArray();

        CollectionAssert.AreEqual(
            new[] { "../../../src/backend/MemberProfile.Backend.csproj" },
            references);
    }

    private static XDocument LoadBackendProject() =>
        XDocument.Load(
            Path.Combine(
                FindRepositoryRoot(),
                "src",
                "backend",
                "MemberProfile.Backend.csproj"));

    private static string FindRepositoryRoot()
    {
        for (var directory = new DirectoryInfo(AppContext.BaseDirectory);
             directory is not null;
             directory = directory.Parent)
        {
            if (File.Exists(
                    Path.Combine(
                        directory.FullName,
                        "src",
                        "backend",
                        "MemberProfile.Backend.csproj")))
            {
                return directory.FullName;
            }
        }

        throw new DirectoryNotFoundException(
            "Could not locate the repository root from the test output directory.");
    }
}
