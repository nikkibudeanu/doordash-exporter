const getAvailableIcons = (assetGroups) => {
  const icons = {};
  assetGroups.forEach((assetGroup) => {
    assetGroup.icons.forEach((icon) => {
      const figmaComponentKey = icon.origin.id;
      const name = icon.origin.name.split("/");
      name.shift();
      icons[figmaComponentKey] = name
        .filter(
          (entry) => entry !== "Icons 2.0" && entry !== "Deprecated Icons"
        )
        .join("/");
    });
  });

  return JSON.stringify(icons, null, 2);
};

Pulsar.registerFunction("getAvailableIcons", getAvailableIcons);
