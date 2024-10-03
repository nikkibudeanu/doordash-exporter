/**
 * Note: The concept of themes used in these helpers are not based on Supernova's theme feature.
 * In our Icons Figma file, we keep top level pages that are Theme overrides.
 * Default or 'DoorDash' is currently called Icons and is used for most themes.
 * Caviar is currently called 'Caviar Icons' and is only used in Caviar.
 * The below functions assume we may add more theme icon subsets down the road down the road.
 * As of September 2023, we have chosen to not change anything in our Figma files.
 * Below you'll find that Caviar and Default slightly differently in their data structures. 
 * Caviar Icons:  Caviar Icons/size/icon-name
 * Icons (aka: Default): Icons/Icons | Deprecated Icons/size/icon-name
 * We account for that below in various places by manually checking for Icons or Deprecated Icons as the second segment.
 * In general a page won't have Deprecated Icons and Icons unless needed. So the scripts below account that any page could have either structure.
 */

const pascalCase = (text) => text.replace(/(^\w|-\w)/g, clearAndUpper);

const clearAndUpper = (text) => text.replace(/-/, "").toUpperCase();

const sortIconNames = (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

const parseIconData = (iconPath) => {
  const pathSegments = iconPath.split("/");
  const theme = pathSegments[0].split(" ")[0] === 'Icons' ? 'DoorDash' : pathSegments[0].split("Icons")[0].replaceAll(" ", "")
  const directory = theme === 'DoorDash' ? 'default' : theme.toLowerCase()
  const fileName = pathSegments[pathSegments.length - 1];
  const iconName = pascalCase(fileName);
  const size = pathSegments[pathSegments.length - 2];
  const isDeprecated = iconPath.includes("Deprecated Icons");
  return {
    iconPath,
    directory,
    theme,
    iconName,
    fileName,
    size,
    isDeprecated,
  };
};


/** Main logic for asset_path.pr */
const getAssetOutput = (path) => {
  const { directory, size, fileName } = parseIconData(path)

  const assetPath = `${directory}/${size}/${fileName}`;

  if (assetPath) {
    return assetPath;
  }
};

/** Main logic for icon_semantics.pr */
const getAvailableIcons = (assetGroups) => {
/* -- assetGroups Example: --
  [
    groupName: 'Icons',
    {
      icons: [{
          id: '328cba17-afbe-4713-8a4c-cdc661b925e5',
          brandId: 'd15dc5c7-04c2-4c3f-9a43-88a2be234bf7',
          thumbnailUrl:
          'https://studio-assets.supernova.io/design-systems/18109/85babcb9-97b6-4254-b7c9-f2ec70a49462.png',
          previouslyDuplicatedNames: 2,
          name: 'home-fill',
          description: 'Caviar',
          componentId: '6858145',
          origin: {
          sourceId: '83a233bf-f1bc-435d-89d2-436f44be9c37',
          id: '4feb37e50fb6cd58342a0f738015279b43340270',
          nodeId: '5554:49',
          name: 'Caviar Icons/24/home-fill',
          fileId: 'yXC84gSOgCe4tZ6U1AUtoj',
          fileName: 'Prism Assets: Icons (2.0)',
          sourceType: 'Figma',
          width: 24,
          height: 24,
        },
        createdAt: null,
        updatedAt: null,
      }]
    }
  ],
*/

  const icons = {};
  // Initialize empty objects for each "theme"
  // We use objects making data setting easier. 
  // We sort and organize these into arrays when we return our of this function
  // Get the first chunk of an asset like Caviar Icons/24/home-fill or Icons/Icons/24/home-fill
  assetGroups.forEach((assetGroup) => {
    assetGroup.icons.forEach((icon) => {
      const { theme, directory } = parseIconData(icon.origin.name);
      icons[theme] = { directory, icons: {} } ;
    });
  });

  assetGroups.forEach((assetGroup) => {
    assetGroup.icons.forEach((icon) => {
      const { theme, fileName, iconName, size, isDeprecated } =
        parseIconData(icon.origin.name);

      if (icons[theme]['icons'][iconName]) {
        //if we already have it, just push the new size variant
        icons[theme]['icons'][iconName]["sizes"].push(size);
      } else {
        icons[theme]['icons'][iconName] = {
          sizes: [size],
          deprecated: isDeprecated,
          fileName,
          name: iconName,
        };
      }
    });
  });

  //Convert objects to arrays and sort
  return Object.keys(icons).map((iconSet) => {
    {
      return {
        iconSetName: iconSet,
        iconDirectory: icons[iconSet]['directory'],
        icons: Object.keys(icons[iconSet]['icons'])
          .map((icon) => {
            return icons[iconSet]['icons'][icon];
          })
          .sort(sortIconNames),
      };
    }
  });
};

Pulsar.registerFunction("getAssetOutput", getAssetOutput);
Pulsar.registerFunction("getAvailableIcons", getAvailableIcons);
