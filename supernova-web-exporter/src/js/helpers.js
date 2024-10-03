// ------------------------------------------------------------
// Utilities
// ------------------------------------------------------------

// This function takes in a camel case string and converts it to kebab case
const kebabize = (str) =>
  str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? "-" : "") + $.toLowerCase()
  );

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

// ------------------------------------------------------------
// Constants
// ------------------------------------------------------------

// This is a map between our token types and the token types that Supernova uses
const SupernovaTokenTypeMap = {
  borderRadius: "Measure",
  borderWidth: "Measure",
  color: "Color",
  elevation: "Shadow",
  fontFamily: "GenericToken",
  fontSize: "Measure",
  fontWeight: "GenericToken",
  size: "Measure",
  space: "Measure",
  type: "Typography",
  motion: "GenericToken",
};

// Categories and tiers of our tokens that we will be generating/accessing
const tiers = ["base", "usage", "comp"];
const categories = Object.keys(SupernovaTokenTypeMap).map(kebabize);
const categoriesAndTiers = [...tiers, ...categories];

// Font Weight Mappings, based on what the common names are for font weights
// there are duplicates in here, but that is expected as some font families
// will use slightly different names. This should capture most if not all of them
const StandardWeightMappings = {
  black: 900,
  extrablack: 800,
  extrabold: 800,
  heavy: 800,
  bold: 700,
  demibold: 600,
  semibold: 600,
  medium: 500,
  regular: 400,
  book: 400,
  light: 300,
  extralight: 200,
  thin: 100,
};

// ------------------------------------------------------------
// Helper Functions
// ------------------------------------------------------------

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

const filterSupernovaPrefixes = (pathArray) => {
  const filteredArray = pathArray.filter(filterTokenCategories);
  if (tiers.includes(filteredArray[0])) {
    return [...filteredArray];
  } else {
    return filterSupernovaPrefixes([...filteredArray]);
  }
};

// This function takes in a token, its parent, and generates a css property name for it.
// for example: --base-color-brand-doordash-50
function generateCssPropertyName(token, tokenGroup) {
  const segments = filterSupernovaPrefixes(tokenGroup.path);
  if (!tokenGroup.isRoot) {
    segments.push(tokenGroup.name);
  }

  segments.push(token.name);

  // Ensure all entries within the segments array are lowercase, and then join them with a hyphen.
  let kebabCaseName = segments
    .map((nameEntry) => {
      if (nameEntry.indexOf("-") > -1) {
        return nameEntry
          .split("-")
          .map((nameEntryPart) => {
            return (
              nameEntryPart.charAt(0).toLowerCase() + nameEntryPart.substring(1)
            );
          })
          .join("-");
      } else {
        return nameEntry.charAt(0).toLowerCase() + nameEntry.substring(1);
      }
    })
    .join("-");

  // only allow letters, digits, hyphens
  kebabCaseName = kebabCaseName.replace(/[^a-zA-Z0-9-]/g, "-");

  return kebabCaseName;
}

// Filter tokens by type
const filterTokensByType = (tokens, supernovaTokenType, prismTokenType) => {
  let filteredTokens = tokens;

  if (supernovaTokenType !== "none") {
    filteredTokens = filteredTokens.filter(
      (token) => token.tokenType === supernovaTokenType
    );
  }
  if (prismTokenType !== "none") {
    const formattedPrismTokenType = kebabize(prismTokenType);
    filteredTokens = filteredTokens.filter((token) => {
      const pathToToken = [...token.parent.path, token.parent.name, token.name];
      return pathToToken.includes(formattedPrismTokenType);
    });
  }

  return filteredTokens;
};

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

// This function takes in a measure token's unit, and returns the usable symbol for that unit.
const getSymbolForUnit = (unit) => {
  switch (unit) {
    case "Pixels":
      return "px";
    case "Percent":
      return "%";
    default:
      return "";
  }
};

// This function takes in a measure token's value and returns either the css variable that it
// references, or the value with the unit symbol appended.
const generateMeasureTokenValue = (tokenValue) => {
  if (tokenValue.referencedToken) {
    return `var(--${generateCssPropertyName(
      tokenValue.referencedToken,
      tokenValue.referencedToken.parent
    )})`;
  }

  return `${tokenValue.measure}${getSymbolForUnit(tokenValue.unit)}`;
};

// This function takes in a token and its type and returns the css variable that the token refrences,
// or the formatted value of the token
const getTokenValue = (token, tokenType) => {
  // If a token references a token with a different type, we have to handle that by checking for some data
  // on the origin of the token. If the origin has a referenceOriginId, we can use that to generate the
  // CSS Property Name, and then use that to generate the CSS Variable Name.
  if (token.origin?.referenceOriginId) {
    const parentPath = token.origin.referenceOriginId.split("/");
    const tokenName = parentPath.pop();
    const fakeToken = {
      name: tokenName,
    };
    const fakeParent = {
      isRoot: true,
      path: parentPath,
    };
    const cssPropName = generateCssPropertyName(fakeToken, fakeParent);
    return `var(--${cssPropName})`;
  }

  // If the token value directly references another token, return the css variable
  if (token.value.referencedToken && tokenType !== "type") {
    return `var(--${generateCssPropertyName(
      token.value.referencedToken,
      token.value.referencedToken.parent
    )})`;
  } else if (token.value.referencedToken && tokenType === "type") {
    const referencedCssPropertyBase = generateCssPropertyName(
      token.value.referencedToken,
      token.value.referencedToken.parent
    );

    return {
      fontFamily: `var(--${referencedCssPropertyBase}-font-family)`,
      fontWeight: `var(--${referencedCssPropertyBase}-font-weight)`,
      size: `var(--${referencedCssPropertyBase}-size)`,
      lineHeight: `var(--${referencedCssPropertyBase}-line-height)`,
      letterSpacing: `var(--${referencedCssPropertyBase}-letter-spacing)`,
      textDecoration: `var(--${referencedCssPropertyBase}-text-decoration)`,
    };
  }

  if (tokenType === "color" && token.value.hex) {
    return `#${token.value.hex}`;
  } else if (tokenType === "color" && token.value.type === "Linear") {
    // Handling gradient tokens
    // Angle is defined by parent name: 'to-left', 'to-right', 'to-top', 'to-bottom', etc.
    const gradientAngle = token.parent.name.split("-").join(" ");
    // Stops come back with a position value between 0 and 1, and a color value,
    // we need to convert that to a string that can be used as part of a css gradient
    const gradientStops = token.value.stops.map((stop) => {
      return `#${stop.color.hex} ${stop.position * 100}%`;
    });

    // Join angle and stops into a string that can be used in a css gradient
    return `linear-gradient(${gradientAngle}, ${gradientStops.join(", ")})`;
  } else if (tokenType === "type") {
    // Building out the type object
    // TODO: fontFamily and fontWeight should support being referential
    const typeObject = {};

    if (token.value.font.family) {
      // Hardcoding this to reference the base CSS variable to be able to retheme the fontFamily from the base token
      // When/if the bug on the Supernova side is resolved we can revert this
      typeObject.fontFamily = "var(--base-font-family-default)";
      // typeObject.fontFamily = token.value.font.family;
    }

    if (token.value.font.subfamily) {
      typeObject.fontWeight =
        StandardWeightMappings[token.value.font.subfamily.toLowerCase()] ||
        token.value.font.subfamily;
    }

    if (token.value.fontSize) {
      typeObject.size = generateMeasureTokenValue(token.value.fontSize);
    }

    if (token.value.lineHeight) {
      typeObject.lineHeight = generateMeasureTokenValue(token.value.lineHeight);
    }

    if (token.value.letterSpacing) {
      typeObject.letterSpacing = generateMeasureTokenValue(
        token.value.letterSpacing
      );
    }

    if (token.value.textDecoration) {
      typeObject.textDecoration = token.value.textDecoration.toLowerCase();
    }

    return typeObject;
  } else if (
    tokenType === "size" ||
    tokenType === "space" ||
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
    )} ${generateMeasureTokenValue(token.value.spread)} #${
      token.value.color.hex
    }`;
  } else if (tokenType === "fontWeight") {
    return (
      StandardWeightMappings[token.value.text.toLowerCase()] || token.value.text
    );
  } else if (tokenType === "fontFamily") {
    return token.value.text;
  } else if (tokenType === "motion") {
    if(token.parent.path.includes('duration') || token.parent.path.includes('delay')){
      /**
       * This adds ms to the generic values for duration and delay.
       * Example: SN: "500" -> TokenExport: "500ms" 
      */
      return `${token.value.text}ms`;
    }
    if(token.parent.path.includes('easing')){
      /**
       * This transforms the easing array to a css value.
       * Example: "[1,1,1,1]" -> "cubic-bezier(1,1,1,1)"
      */
      const easingRaw = token.value.text.slice(1,-1)
      return `cubic-bezier(${easingRaw})`
    }
      /**
       * Pass through the raw text incase of user error in Supernova and we are lacking
       * a duration, delay, or easing parent.
      */
      return token.value.text;
  } else {
    return token.value;
  }
};

// Takes in a token path, and returns the Prism token type.
const getPrismTokenType = (tokenPath) => {
  const cleanedTokenPath = tokenPath.filter((pathEntry) => {
    if (pathEntry === "base" || pathEntry === "usage" || pathEntry === "comp") {
      return false;
    }
    return true;
  });

  const prismTokenType = cleanedTokenPath[0];
  return kebabToCamelCase(prismTokenType);
};

// ------------------------------------------------------------
// Pulsar Functions
// ------------------------------------------------------------

// This funciton takes in an array of tokens and only returns the tokens for the provided tier
// the tiers that are available are base, usage, and comp
Pulsar.registerFunction("getTokensForTier", function (tokens, tier) {
  if (!tokens) {
    return [];
  }
  const tokensForTier = tokens.filter((token) =>
    token.parent.path.includes(tier)
  );

  return tokensForTier.length > 0 ? tokensForTier : [];
});

Pulsar.registerFunction("separateThemeName", (themeName) => {
  const collectionName = themeName.replace("Dark", "");
  const mode = themeName.toLowerCase().includes("dark") ? "dark" : "default";

  return [collectionName, mode];
});

Pulsar.registerFunction("generateFileName", function (...args) {
  return `${args.join("/")}.ts`;
});

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

    if (prismTokenType === "color") {
      const gradientTokens = filterTokensByType(tokens, "Gradient", "color");
      filteredTokens.push(...gradientTokens);
    }

    return filteredTokens;
  }
);

// This function takes in themeName, tokens, and optionally tier, and tokenType to generate a context object
// that can be passed through blueprints to generate files.
Pulsar.registerFunction(
  "generateContextObject",
  function (themeName, tokens, tier = "unknown", tokenType = "unknown") {
    return {
      themeName,
      tokens,
      tier,
      tokenType,
    };
  }
);

// This function takes in an array of tokens, and the token's type and returns a formatted, and resolved
// object that can be used to generate a file.
Pulsar.registerFunction("createTokenObject", function (tokens, tokenType) {
  let tokenTier = {};

  tokens.forEach((token) => {
    if (!isKebabCase(token.name)) {
      return;
    }

    const pathToToken = filterSupernovaPrefixes([
      ...token.parent.path,
      token.parent.name,
      token.name,
    ])
      .filter(isValidPathEntry)
      .map(kebabToCamelCase);

    const tokenValue = getTokenValue(token, tokenType);
    tokenTier = addToObjectAtPath(pathToToken, tokenTier, tokenValue);
  });

  return JSON.stringify(tokenTier, null, 2);
});

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

// This function takes in the the tokens for a theme, and returns an array of the tiers that are present
// and the prism token types that are present in each tier.
Pulsar.registerFunction("getTiersInTheme", (tokens) => {
  const tiersInTheme = {};
  tokens.forEach((token) => {
    const tokenPath = filterSupernovaPrefixes([
      ...token.parent.path,
      token.parent.name,
      token.name,
    ]);
    const tier = tokenPath[0];

    if (tiers.includes(tier)) {
      if (!tiersInTheme[tier]) {
        tiersInTheme[tier] = [];
      }

      const prismTokenType = getPrismTokenType(tokenPath);

      if (!tiersInTheme[tier].includes(prismTokenType)) {
        tiersInTheme[tier].push(prismTokenType);
      }
    }
  });

  return Object.entries(tiersInTheme);
});

Pulsar.registerFunction("generateTierFilePath", function (themeName, tierName) {
  return `${themeName}/${tierName}/index.ts`;
});

Pulsar.registerFunction(
  "generateThemeIndexFilePath",
  (themeName) => `${themeName}/index.ts`
);

// Create an array of token collections to create files for based off of token themes
Pulsar.registerFunction("generateThemeCollections", (themes) => {
  const collections = {
    Default: {
      name: "Default",
      modes: [
        {
          name: "Default",
          path: "default",
        },
      ],
    },
  };

  themes.forEach((theme) => {
    const name = theme.name;
    const path = name.toLowerCase().includes("dark") ? "dark" : "default";
    const collectionName = name.replace("Dark", "");

    if (collections[collectionName]) {
      collections[collectionName].modes.push({
        name,
        path,
      });
    } else {
      collections[collectionName] = {
        name: collectionName,
        modes: [
          {
            name,
            path,
          },
        ],
      };
    }
  });

  return Object.values(collections);
});
