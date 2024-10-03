// This is a map between our token types and the token types that Supernova uses
const SupernovaTokenTypeMap = {
  borderRadius: "Measure",
  borderWidth: "Measure",
  color: "Color",
  fontFamily: "GenericToken",
  sizing: "Measure",
  fontSize: "Measure",
  spacing: "Measure",
  type: "Typography",
  weight: "GenericToken",
};

const SupportedThemes = [
  "Default",
  "DefaultDark",
  "Caviar",
  "CaviarDark",
  "InternalTools",
  "InternalToolsDark",
  "Merchant",
  "DashPlus",
  "Consumer",
  "ConsumerDark",
  "MxTablet"
];

// Categories and tiers of our tokens that we will be generating/accessing
const tiers = ["base", "usage", "comp"];
const categories = Object.keys(SupernovaTokenTypeMap);
const categoriesAndTiers = [...tiers, ...categories];

// This function takes in a pathEntry from a token and checks to make sure it is
// something we would want to use as part of the path for our generated tokens.
function isValidPathEntry(pathEntry) {
  for (let i = 0; i < categoriesAndTiers.length; i++) {
    if (pathEntry === categoriesAndTiers[i]) {
      return false;
    }
  }
  return true;
}

function isThemeSupported(themeName) {
  return SupportedThemes.includes(themeName);
}

function isDarkTheme(themeName) {
  return themeName.endsWith("Dark");
}

function getParentThemeResourceId(themeName) {
  if (themeName === "Default") {
    return "Base.Theme.Prism";
  }
  if (!isDarkTheme(themeName)) {
    return "Generated.Theme.DoorDash";
  }
  let name = "DoorDash";
  if (!themeName.startsWith("Default")) name = normalizeThemeName(themeName);
  return `Base.Theme.Prism.${name}.Shaped`;
}

function getParentOverlayThemeResourceId(themeName) {
  if (themeName === "Default") {
    return "";
  } else {
    return `ThemeOverlay.Prism.Color.Default`;
  }
}

function stringify(object) {
  return JSON.stringify(object);
}

function getThemeResourceId(themeName) {
  if (themeName === "Default") {
    return "Generated.Theme.Default";
  }

  return `Generated.Theme.${themeName}`;
}

function getOverlayThemeResourceId(themeName) {
  return `ThemeOverlay.Prism.Color.${themeName}`;
}

function getComposeParentColorClass() {
  return "PrismPalette";
}

function getComposeParentDimensClass(themeName) {
  if (themeName === "Default") {
    return "PrismDimensInterface";
  }

  return "PrismDimensInterface by DefaultDimens";
}

function getTextStyleResourceId(token, themeName) {
  const pathToToken = filterSupernovaPrefixes([
    ...token.parent.path,
    token.parent.name,
    token.name,
    ])
    .filter(isValidPathEntry)
    .map(kebabToCamelCase);
  return `TextAppearance.${themeName}.${pascalcase(
    arrayJoin(pathToToken, " ")
  )}`;
}

function getComposeTextStyleName(token) {
  const pathToToken = filterSupernovaPrefixes([
    ...token.parent.path,
    token.parent.name,
    token.name,
    ])
    .map(kebabToCamelCase);
  return `${camelcase(arrayJoin(pathToToken, " "))}`;
}

function normalizeThemeName(themeName) {
  return themeName.replace("Dark", "");
}

function internalOrBlank(tokenGroup) {
  if (isUsageToken(tokenGroup)) {
    return "var "
  }
  return "internal var ";
}

function internalMeasureOrBlank(tokenGroup) {
  if (isUsageMeasureToken(tokenGroup)) {
    return "var "
  }
  return "internal var ";
}

function internalSetOrBlank(tokenGroup) {
  if (isUsageToken(tokenGroup)) {
    return "    internal set\n"
  }
  return "";
}

function internalSetMeasureOrBlank(tokenGroup) {
  if (isUsageMeasureToken(tokenGroup)) {
    return "    internal set\n"
  }
  return "";
}

function getTypographyForTheme(themeName) {
  let outputObject = "PrismTextStyles";
  if (themeName !== "Default") {
    outputObject = "PrismTextStyles by DefaultTypography";
  }
  return outputObject;
}

function camelcase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  }).split("-").join("");
}

function camelcaseWithZeros(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (/\s+/.test(match)) return "";
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  }).split("-").join("");
}

function pascalcase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return match.toUpperCase();
  });
}

function snakecase(str) {
  return str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? "_" : "") + $.toLowerCase()
  );
}

function kebabcase(str) {
  return str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? "-" : "") + $.toLowerCase()
  );
}

function toLowerCase(str) {
  return str.toLowerCase();
}

/**
 *
 * @param {string} text
 * @param {string} indentationString
 *
 * @returns {string}
 */
function indentMultilineText(text, indentationString) {
  return text
    .trim()
    .split("\n")
    .join("\n" + indentationString);
}

/**
 *
 * @param {{name: string, isRoot: boolean, path: Array<string>}} tokenGroup
 *
 * @returns {Array<string>}
 */
function createFullTokenGroupPath(tokenGroup) {
  if (tokenGroup.isRoot) {
    return [];
  } else {
    return tokenGroup.path.concat(tokenGroup.name).map(kebabToCamelCase);
  }
}

/**
 *
 * @param {{name: string, isRoot: boolean, path: Array<string>}} tokenGroup
 *
 * @returns {Array<string>}
 */
function createNamedTokenGroupPath(tokenGroup) {
  if (tokenGroup.isRoot) {
    return [];
  } else {
    return tokenGroup.path.filter(isValidPathEntry).concat(tokenGroup.name);
  }
}

function createSimpleTokenGroupPath(tokenGroup) {
  let fullPath = createFullTokenGroupPath(tokenGroup);
  let size = tokenGroup.length;
  return fullPath.splice(2, size - 2);
}

/**
 *
 * @param {Array<any>} lhs
 * @param {Array<any>} rhs
 *
 * @returns {Array<any>}
 */
function arrayConcat(lhs, rhs) {
  return lhs.concat(rhs);
}

/**
 *
 * @param {Array<string>} array
 * @param {string} separator
 */
function arrayJoin(array, separator) {
  return array.join(separator);
}

/**
 *
 * @param {Array<string>} array
 * @param {number} index
 * @param {number} count
 *
 * @returns {Array<string>}
 */
function arraySplice(array, index, count) {
  array.splice(index, count);
  return array;
}

function groupFontsByFamily(fonts) {
  var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key].toLowerCase()] = rv[x[key].toLowerCase()] || []).push(x);
      return rv;
    }, {});
  };

  return groupBy(fonts, "family");
}

/**
 *
 * @param {string} s
 */
function isDigit(c) {
  return c >= "0" && c <= "9";
}

function removeSpaces(name) {
  return name.replace(" ", "");
}

function rgbaToArgb(rgba) {
  const red = rgba.substring(0, 2);
  const green = rgba.substring(2, 4);
  const blue = rgba.substring(4, 6);
  const alpha = rgba.substring(6, 8);
  return `${alpha}${red}${green}${blue}`.toUpperCase();
}

function isBaseToken(tokenGroup) {
  if (tokenGroup.isRoot) {
    return false;
  } else {
    return tokenGroup.path[0] === "base";
  }
}

function isUsageMeasureToken(tokenGroup) {
  if (tokenGroup.isRoot) {
    return false;
  } else {
    return (tokenGroup.path[0] === "usage") || (tokenGroup.path[2] === "usage");
  }
}

function isUsageToken(tokenGroup) {
  if (tokenGroup.isRoot) {
    return false;
  } else {
    return tokenGroup.path[0] === "usage";
  }
}

function isUsageSizingToken(validTokenName) {
  return validTokenName.includes("usage");
}

function isComponentToken(tokenGroup) {
  if (tokenGroup.isRoot) {
    return false;
  } else {
    return tokenGroup.path[0] === "comp";
  }
}

function generateThemeFilePath(themeName) {
  let resFolderName = `res`;
  if (normalizeThemeName(themeName).toLowerCase() !== "default") {
    resFolderName = `res-${normalizeThemeName(themeName).toLowerCase()}`;
  }
  if (isDarkTheme(themeName)) {
    return `dls/src/main/kotlin/com/doordash/android/dls/theme/${resFolderName}/values-night/theme-${kebabcase(
      themeName
    )}-generated.xml`;
  } else {
    return `dls/src/main/kotlin/com/doordash/android/dls/theme/${resFolderName}/values/theme-${kebabcase(
      themeName
    )}-generated.xml`;
  }
}

function generateOverlayThemeFilePath(themeName) {
  return `dls/src/main/kotlin/com/doordash/android/dls/theme/res/values/theme-${kebabcase(
    themeName
  )}-overlay-generated.xml`;
}

function generateTextStyleFilePath(themeName) {
  let resFolderName = `res`;
  if (themeName !== "Default") {
    resFolderName = resFolderName.concat(`-${kebabcase(themeName)}`);
  }
  return `dls/src/main/kotlin/com/doordash/android/dls/foundation/${resFolderName}/values/text-styles-${kebabcase(
    themeName
  )}-generated.xml`;
}

function generateDimensFilePath(themeName) {
  return `prism-compose/src/main/kotlin/com/doordash/android/prism/compose/foundation/dimens/${pascalcase(
    themeName
  )}Dimens.kt`;
}

function generateComposeTextStyleFilePath(themeName) {
  return `prism-compose/src/main/kotlin/com/doordash/android/prism/compose/foundation/typography/${pascalcase(
    themeName
  )}Typography.kt`;
}

function generateComposeThemeColorsFilePath(themeName) {
  return `prism-compose/src/main/kotlin/com/doordash/android/prism/compose/foundation/color/${pascalcase(
    themeName
  )}Colors.kt`;
}

function sortTokenTypes(tokenTypes) {
  return tokenTypes.sort((a, b) => {
    if (a.prismTokenType.includes("sizing")) {
      return b.prismTokenType.includes("sizing") ? 0 : -1;
    }

    if (a.prismTokenType.includes("spacing")) {
      return b.prismTokenType.includes("spacing")
        ? 0
        : b.prismTokenType.includes("sizing")
        ? 1
        : -1;
    }

    if (a.prismTokenType.includes("borderWidth")) {
      return b.prismTokenType.includes("borderWidth") ? 0 : 1;
    }

    return 0;
  });
}

// With some tokens there is a category prefix that is added to the token name by Supernova,
// this function removes that prefix.
const filterTokenCategories = (pathEntry, index) => {
  if (index === 0) {
    for (let i = 0; i < tiers.length; i++) {
      if (pathEntry === tiers[i]) {
        return true;
      }
    }
    return false;
  }

  return true;
};

// This function takes in a token, its parent, and generates a xml resource property name for it.
// for example: base_color_brand_doordash_50
function generateXmlResourcePropertyName(token, tokenGroup) {
  const segments = filterSupernovaPrefixes([
    ...token.parent.path,
    token.parent.name,
    token.name,
    ])
    .filter(isValidPathEntry);

  if (!tokenGroup.isRoot) {
    segments.push(tokenGroup.name);
  }

  segments.push(token.name);

  return arrayJoin(segments, "_");
}

// This function takes in a token, its parent, and generates a xml attribute property name for it.
// for example: base_color_brand_doordash_50
function generateXmlAttributePropertyName(token, tokenGroup) {
  const segments = tokenGroup.path.filter(filterTokenCategories);

  if (!tokenGroup.isRoot) {
    segments.push(tokenGroup.name);
  }

  segments.push(token.name);
  if (token.tokenType === "Measure" || token.tokenType === "Shadow") {
    arraySplice(segments, 0, 1)
    return camelcaseWithZeros(arrayJoin(segments.map(kebabToCamelCase), " "));
  }
  return camelcase(arrayJoin(segments.map(kebabToCamelCase), " "));
}

// This function takes in a measure token's unit, and returns the usable symbol for that unit.
const getSymbolForUnit = (unit) => {
  switch (unit) {
    case "Pixels":
      return "dp";
    case "Percent":
      return "%";
    default:
      return "";
  }
};

// This function takes in a measure token's value and returns either the css variable that it
// references, or the value with the unit symbol appended.
const generateMeasureTokenValue = (tokenValue) => {
  if (tokenValue == null) {
    return "";
  }
  if (tokenValue.referencedToken) {
    return `@dimen/${generateXmlResourcePropertyName(
      tokenValue.referencedToken,
      tokenValue.referencedToken.parent
    )}`;
  }
  return `${tokenValue.measure}${getSymbolForUnit(tokenValue.unit)}`;
};

// This function takes in a measure token's value and returns either the css variable that it
// references, or the value with the unit symbol appended.
const generateComposeMeasureTokenValue = (tokenValue) => {
  if (tokenValue == null) {
    return "";
  }
  if (tokenValue.referencedToken) {
    return `${generateXmlResourcePropertyName(
      tokenValue.referencedToken,
      tokenValue.referencedToken.parent
    )}`;
  }
  return `${tokenValue.measure}.${getSymbolForUnit(tokenValue.unit)}`;
};

// This function takes in a token and its type and returns the css variable that the token refrences,
// or the formatted value of the token.
const getOverlayColorTokenValue = (token) => {
  if (token.value.referencedToken) {
    return `?${generateXmlAttributePropertyName(token.value.referencedToken, token.value.referencedToken.parent)}`
  }

  return `#${rgbaToArgb(token.value.hex.toUpperCase())}`;
};

const filterSupernovaPrefixes = (pathArray) => {
  const filteredArray = pathArray.filter(filterTokenCategories);
  if (tiers.includes(filteredArray[0])) {
    return [...filteredArray];
  } else {
    return filterSupernovaPrefixes([...filteredArray]);
  }
};

// This function takes in a token and its type and returns the css variable that the token refrences,
// or the formatted value of the token
const getTokenValue = (token, tokenType, themeName) => {
  // If the token value directly references another token, return the css variable
  if (token.value.referencedToken) {
    if (isBaseToken(token.value.referencedToken.parent)) {
      if (tokenType === "color") {
        return `?${generateXmlAttributePropertyName(
          token.value.referencedToken,
          token.value.referencedToken.parent
        )}`;
      } else if (
        tokenType === "borderRadius" ||
        tokenType === "sizing" ||
        tokenType === "spacing" ||
        tokenType === "borderWidth" ||
        tokenType === "fontSize" ||
        tokenType === "elevation"
      ) {
        return `@dimen/${generateXmlResourcePropertyName(
          token.value.referencedToken,
          token.value.referencedToken.parent
        )}`;
      } else if (tokenType === "type") {
        return `@style/${generateXmlResourcePropertyName(
          token.value.referencedToken,
          token.value.referencedToken.parent
        )}`;
      }
    } else {
      return `?${generateXmlAttributePropertyName(
        token.value.referencedToken,
        token.value.referencedToken.parent
      )}`;
    }
  }

  if (tokenType === "color" && token.value.hex) {
    return `#${rgbaToArgb(token.value.hex.toUpperCase())}`;
  } else if (tokenType === "type") {
    const pathToToken = filterSupernovaPrefixes([
      ...token.parent.path,
      token.parent.name,
      token.name,
      ])
      .filter(isValidPathEntry)
      .map(kebabToCamelCase);
    return `@style/TextAppearance.${normalizeThemeName(themeName)}.${pascalcase(
      arrayJoin(pathToToken, " ")
    )}`;
  } else if (
    tokenType === "sizing" ||
    tokenType === "spacing" ||
    tokenType === "borderWidth" ||
    tokenType === "fontSize" ||
    tokenType === "borderRadius"
  ) {
    return generateMeasureTokenValue(token.value);
  } else if (tokenType === "elevation") {
    return `${generateMeasureTokenValue(
      token.value.x
    )} ${generateMeasureTokenValue(token.value.y)} ${generateMeasureTokenValue(
      token.value.radius
    )} ${generateMeasureTokenValue(token.value.spread)} #${rgbaToArgb(
      token.value.color.hex
    )}`;
  } else if (tokenType === "fontFamily" || tokenType === "weight") {
    return token.value.text;
  } else {
    return token.value;
  }
};

const getTypeTokenValue = (token, tokenType, themeName) => {};

// This function takes in a token and its type and returns the css variable that the token refrences,
// or the formatted value of the token
const getComposeTokenValue = (token, tokenType, themeName) => {
  // If the token value directly references another token, return the css variable
  if (token.value.referencedToken) {
    if (isBaseToken(token.value.referencedToken.parent)) {
      if (tokenType === "color") {
        return `${generateXmlAttributePropertyName(
          token.value.referencedToken,
          token.value.referencedToken.parent
        )}`;
      } else if (tokenType === "borderRadius") {
        return `CornerSize(${generateXmlResourcePropertyName(
          token.value.referencedToken,
          token.value.referencedToken.parent
        )})`;
      } else if (
        tokenType === "size" ||
        tokenType === "spacing" ||
        tokenType === "borderWidth" ||
        tokenType === "fontSize"
      ) {
        return `${generateXmlResourcePropertyName(
          token.value.referencedToken,
          token.value.referencedToken.parent
        )}`;
      } else if (tokenType === "type") {
        return `@style/${generateXmlResourcePropertyName(
          token.value.referencedToken,
          token.value.referencedToken.parent
        )}`;
      }
    } else {
      return `${generateXmlAttributePropertyName(
        token.value.referencedToken,
        token.value.referencedToken.parent
      )}`;
    }
  }

  if (tokenType === "color" && token.value.hex) {
    return `Color(color = 0x${rgbaToArgb(token.value.hex)})`;
  } else if (tokenType === "type") {
    const pathToToken = filterSupernovaPrefixes([
      ...token.parent.path,
      token.parent.name,
      token.name,
      ])
      .filter(isValidPathEntry)
      .map(kebabToCamelCase);
    return `@style/TextAppearance.${themeName}.${pascalcase(
      arrayJoin(pathToToken, " ")
    )}`;
  } else if (tokenType === "borderRadius") {
    if (token.value.radius)
      return `CornerSize(${generateComposeMeasureTokenValue(
        token.value.radius
      )})`;
    else return generateComposeMeasureTokenValue(token.value);
  } else if (
    tokenType === "sizing" ||
    tokenType === "spacing" ||
    tokenType === "borderWidth" ||
    tokenType === "fontSize"
  ) {
    return generateComposeMeasureTokenValue(token.value);
  } else if (tokenType === "elevation") {
    return `${generateComposeMeasureTokenValue(
      token.value.x
    )} ${generateComposeMeasureTokenValue(
      token.value.y
    )} ${generateComposeMeasureTokenValue(
      token.value.radius
    )} ${generateComposeMeasureTokenValue(token.value.spread)} #${rgbaToArgb(
      token.value.color.hex
    )}`;
  } else if (tokenType === "fontFamily" || tokenType === "weight") {
    return token.value.text;
  } else {
    return token.value;
  }
};

// This function takes in a theme object, and a token type and returns all the tokens within
// that theme's overriddenTokens that match the tokenType.
Pulsar.registerFunction(
  "getThemeTokens",
  function (theme, supernovaTokenType = "none", prismTokenType = "none") {
    if (!theme) {
      return [];
    }

    let tokens = theme || [];

    if (theme.overriddenTokens) {
      tokens = theme.overriddenTokens;
    }

    const filteredTokens = filterTokensByType(
      tokens,
      supernovaTokenType,
      prismTokenType
    );
    return filteredTokens;
  }
);

// This function takes in themeName, tokens, and optionally tier, and tokenType to generate a context object
// that can be passed through blueprints to generate files.
Pulsar.registerFunction(
  "generateContextObject",
  function (
    themeName,
    tokens,
    tier = "unknown",
    tokenType = "unknown",
    themeId = "unknown"
  ) {
    return {
      themeId,
      themeName,
      tokens,
      tier,
      tokenType,
    };
  }
);

// Filter tokens by type
const filterTokensByType = (tokens, supernovaTokenType, prismTokenType) => {
  let filteredTokens = tokens;

  if (supernovaTokenType !== "none") {
    filteredTokens = filteredTokens.filter(
      (token) => token.tokenType === supernovaTokenType
    );
  }
  if (prismTokenType !== "none") {
    const formattedPrismTokenType = camelcase(prismTokenType);
    filteredTokens = filteredTokens.filter((token) => {
      const pathToToken = [...token.parent.path, token.parent.name, token.name];
      return pathToToken.map(camelcase).includes(formattedPrismTokenType);
    });
  }

  return filteredTokens;
};

Pulsar.registerFunction("getTokenTypes", () => {
  return Object.entries(SupernovaTokenTypeMap).map(
    ([prismTokenType, supernovaTokenType]) => {
      return {
        prismTokenType,
        supernovaTokenType,
      };
    }
  );
});

// This function takes in an array of tokens, and the token's type and returns a formatted, and resolved
// object that can be used to generate a file.
Pulsar.registerFunction(
  "createThemeEntries",
  function (tokens, tokenType, themeName) {
    let themeEntries = [];

    tokens.forEach((token) => {
      if (!isKebabCase(token.name)) {
        return;
      }

      const pathToToken = filterSupernovaPrefixes([
        ...token.parent.path,
        token.parent.name,
        token.name,
        ])
        .map(kebabToCamelCase);
      const tokenValue = getTokenValue(token, tokenType, themeName);
      if (token.tokenType === "Measure" || token.tokenType === "Shadow") {
        themeEntries.push(
          `<item name="${camelcaseWithZeros(
            arrayJoin(pathToToken, " ")
          )}">${tokenValue}</item>`
        );
      } else {
        themeEntries.push(
          `<item name="${camelcase(
            arrayJoin(pathToToken, " ")
          )}">${tokenValue}</item>`
        );
      }
    });

    themeEntries.sort((a, b) => {
      if (a.toLowerCase().includes("base")) {
        return b.toLowerCase().includes("base") ? 0 : -1;
      }

      if (a.toLowerCase().includes("usage")) {
        return b.toLowerCase().includes("usage")
          ? 0
          : b.toLocaleLowerCase().includes("base")
          ? 1
          : -1;
      }

      if (a.toLocaleLowerCase().includes("comp")) {
        return b.toLowerCase().includes("comp") ? 0 : 1;
      }

      return 0;
    });

    return arrayJoin(themeEntries, "\n        ");
  }
);

// This function takes in an array of tokens, and the token's type and returns a formatted, and resolved
// object that can be used to generate a file.
Pulsar.registerFunction(
  "createComposeThemeEntries",
  function (tokens, tokenType, themeName) {
    
    let themeEntries = [];
    tokens.forEach((token) => {
      if (!isKebabCase(token.name)) {
        return;
      }

      const pathToToken = filterSupernovaPrefixes([
        ...token.parent.path,
        token.parent.name,
        token.name,
        ])
        .map(kebabToCamelCase)
      const tokenValue = getComposeTokenValue(token, tokenType, themeName);
      if (token.tokenType === "Measure") {
        themeEntries.push(
          `override val ${camelcaseWithZeros(
            arrayJoin(pathToToken, " ")
          )} = ${tokenValue}`
        );
      } else {
        themeEntries.push(
          `override val ${camelcase(
            arrayJoin(pathToToken, " ")
          )} = ${tokenValue}`
        );
      }
    });

    themeEntries.sort((a, b) => {
      if (a.toLowerCase().includes("base") && a.toLowerCase().includes("color(")) {
        return b.toLowerCase().includes("base" && a.toLowerCase().includes("color(") ) ? 0 : -1;
      }

      if (a.toLowerCase().includes("usage")) {
        return b.toLowerCase().includes("usage")
          ? 0
          : b.toLocaleLowerCase().includes("base")
          ? 1
          : -1;
      }

      if (a.toLocaleLowerCase().includes("comp")) {
        return b.toLowerCase().includes("comp") ? 0 : 1;
      }

      return 0;
    });

    return arrayJoin(themeEntries, "\n    ");
  }
);

// This function takes in an array of tokens, and the token's type and returns a formatted, and resolved
// object that can be used to generate a file.
Pulsar.registerFunction("createOverlayThemeEntries", function (tokens) {
  let themeEntries = [];

  tokens.forEach((token) => {
    if (!isKebabCase(token.name)) {
      return;
    }

    const pathToToken = filterSupernovaPrefixes([
      ...token.parent.path,
      token.parent.name,
      token.name,
      ])
      .map(kebabToCamelCase);
    const tokenValue = getOverlayColorTokenValue(token);
    if (token.tokenType === "Measure") {
      themeEntries.push(
        `<item name="${camelcaseWithZeros(
          arrayJoin(pathToToken, " ")
        )}">${tokenValue}</item>`
      );
    } else {
      themeEntries.push(
        `<item name="${camelcase(
          arrayJoin(pathToToken, " ")
        )}">${tokenValue}</item>`
      );
    }
  });

  themeEntries.sort((a, b) => {
    if (a.toLowerCase().includes("base")) {
      return b.toLowerCase().includes("base") ? 0 : -1;
    }

    if (a.toLowerCase().includes("usage")) {
      return b.toLowerCase().includes("usage")
        ? 0
        : b.toLocaleLowerCase().includes("base")
        ? 1
        : -1;
    }

    if (a.toLocaleLowerCase().includes("comp")) {
      return b.toLowerCase().includes("comp") ? 0 : 1;
    }

    return 0;
  });

  return arrayJoin(themeEntries, "\n        ");
});

// This function takes in a kebab case string and converts it to camel case
function kebabToCamelCase(str) {
  return str.replace(/-([a-z])/g, function (match, letter) {
    return letter.toUpperCase();
  });
}

// This function is temporary, and will be removed once we can remove the legacy tokens,
// or prefix them with something that we can filter out.
function isKebabCase(str) {
  // Check if the string contains any uppercase letters
  if (/[A-Z]/.test(str)) {
    return false;
  }

  // Check if the string contains any non-alphanumeric characters except hyphen
  if (/[^\w-]/.test(str)) {
    return false;
  }

  return true;
}

// This function takes in a path, an object, and a value and adds the value to the object
// at the path provided. This will create all necessary nested objects if they do not exist.
function addToObjectAtPath(path, obj, value) {
  if (path.length === 0) {
    // If the path is empty, return the original object without any modifications
    return obj;
  }

  const [currentKey, ...remainingPath] = path;

  if (remainingPath.length === 0) {
    // If there are no more keys in the path, assign the value to the current key
    obj[currentKey] = value;
  } else {
    // If there are more keys in the path, create nested objects if necessary
    if (!obj[currentKey] || typeof obj[currentKey] !== "object") {
      obj[currentKey] = {};
    }

    // Recursively traverse the nested object with the remaining path
    addToObjectAtPath(remainingPath, obj[currentKey], value);
  }

  return obj;
}

Pulsar.registerFunction("getThemeIds", (themeId) => {
  return themeId !== "unknown" ? [themeId] : [];
});

Pulsar.registerFunction("filterSupernovaPrefixes", filterSupernovaPrefixes);
Pulsar.registerFunction("isThemeSupported", isThemeSupported);
Pulsar.registerFunction("isDarkTheme", isDarkTheme);
Pulsar.registerFunction("arraySplice", arraySplice);
Pulsar.registerFunction("isUsageMeasureToken", isUsageMeasureToken);
Pulsar.registerFunction("indentMultilineText", indentMultilineText);
Pulsar.registerFunction("createFullTokenGroupPath", createFullTokenGroupPath);
Pulsar.registerFunction("createNamedTokenGroupPath", createNamedTokenGroupPath);
Pulsar.registerFunction("arrayConcat", arrayConcat);
Pulsar.registerFunction("arrayJoin", arrayJoin);
Pulsar.registerFunction("groupFontsByFamily", groupFontsByFamily);
Pulsar.registerFunction("isDigit", isDigit);
Pulsar.registerFunction("stringify", stringify);
Pulsar.registerFunction(
  "createSimpleTokenGroupPath",
  createSimpleTokenGroupPath
);
Pulsar.registerFunction("removeSpaces", removeSpaces);
Pulsar.registerFunction("getTokenValue", getTokenValue);
Pulsar.registerFunction("getOverlayColorTokenValue", getOverlayColorTokenValue);
Pulsar.registerFunction("getTypeTokenValue", getTypeTokenValue);
Pulsar.registerFunction("generateMeasureTokenValue", generateMeasureTokenValue);
Pulsar.registerFunction("getComposeTokenValue", getComposeTokenValue);
Pulsar.registerFunction("isBaseToken", isBaseToken);
Pulsar.registerFunction("internalOrBlank", internalOrBlank);
Pulsar.registerFunction("internalMeasureOrBlank", internalMeasureOrBlank);
Pulsar.registerFunction("internalSetOrBlank", internalSetOrBlank);
Pulsar.registerFunction("internalSetMeasureOrBlank", internalSetMeasureOrBlank);
Pulsar.registerFunction("isUsageToken", isUsageToken);
Pulsar.registerFunction("isUsageSizingToken", isUsageSizingToken);
Pulsar.registerFunction("isComponentToken", isComponentToken);
Pulsar.registerFunction("pascalcase", pascalcase);
Pulsar.registerFunction("camelcase", camelcase);
Pulsar.registerFunction("snakecase", snakecase);
Pulsar.registerFunction("kebabcase", kebabcase);
Pulsar.registerFunction("kebabToCamelCase", kebabToCamelCase);
Pulsar.registerFunction("generateThemeFilePath", generateThemeFilePath);
Pulsar.registerFunction(
  "generateOverlayThemeFilePath",
  generateOverlayThemeFilePath
);
Pulsar.registerFunction("generateTextStyleFilePath", generateTextStyleFilePath);
Pulsar.registerFunction(
  "generateComposeTextStyleFilePath",
  generateComposeTextStyleFilePath
);
Pulsar.registerFunction(
  "generateComposeThemeColorsFilePath",
  generateComposeThemeColorsFilePath
);
Pulsar.registerFunction("getParentThemeResourceId", getParentThemeResourceId);
Pulsar.registerFunction(
  "getParentOverlayThemeResourceId",
  getParentOverlayThemeResourceId
);
Pulsar.registerFunction("getThemeResourceId", getThemeResourceId);
Pulsar.registerFunction("getOverlayThemeResourceId", getOverlayThemeResourceId);
Pulsar.registerFunction(
  "getComposeParentColorClass",
  getComposeParentColorClass
);
Pulsar.registerFunction("getTextStyleResourceId", getTextStyleResourceId);
Pulsar.registerFunction("getComposeTextStyleName", getComposeTextStyleName);
Pulsar.registerFunction("getTypographyForTheme", getTypographyForTheme);
Pulsar.registerFunction("normalizeThemeName", normalizeThemeName);
Pulsar.registerFunction("sortTokenTypes", sortTokenTypes);
Pulsar.registerFunction("camelcaseWithZeros", camelcaseWithZeros);
Pulsar.registerFunction(
  "getComposeParentDimensClass",
  getComposeParentDimensClass
);
Pulsar.registerFunction("generateDimensFilePath", generateDimensFilePath);
