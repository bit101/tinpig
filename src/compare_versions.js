function versionToInt(version) {
  if (version.charAt(0) === "v") {
    version = version.slice(1);
  }
  const parts = version.split(".");
  const major = parseInt(parts[0], 10);
  const minor = parseInt(parts[1], 10);
  const patch = parseInt(parts[2], 10);
  const total = (major * 100) + (minor * 10) + patch;
  return total;
}

function greaterOrEqualVersion(versionA, versionB) {
  const versionAInt = versionToInt(versionA);
  const versionBInt = versionToInt(versionB);
  return versionAInt >= versionBInt;
}

module.exports = {
  greaterOrEqualVersion,
};
