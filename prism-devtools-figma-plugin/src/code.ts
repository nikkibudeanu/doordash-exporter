import { Density, Semantic } from './types'
import { merge, platforms, letterSpacing, sanitizeName, hasDensityInFilename, hasComponentInFilename, themeName } from './lib'
import { sizes, weights, lineHeightsPxToTokens } from './tokens'

const figmaName = figma.root.name

// get density based on file name, default to "regular"
const density = hasDensityInFilename(figmaName) ? hasDensityInFilename(figmaName).find(Boolean).toLowerCase() : 'regular'

// construct filename, ie
// - typography-tokens-doordash-expanded.json or
// - typography-tokens-caviar-regular-components.json
const fileName = `typography-tokens-${themeName(figmaName)}-${hasComponentInFilename(figmaName) ? `components` : density}.json`

const styles: Semantic[] = [] // list of semantics from figma
const mobile: {} = {} // map of mobile definitions for semantic style
const desktop: {} = {} // map desktop definitions (will be merged with mobile dictionary)

// loop over Figma styles
for (const style of figma.getLocalTextStyles()) {
  let [platform, name] = style.name.replace(/\s/g, '').split('/')

  if (platform !== 'Mobile' && platform !== 'Desktop') {
    // assuming component styles
    name = style.name.replace(/\//g, '')
    platform = 'Mobile'
  } else {
    name = name || platform // if name is undefined, fall back to platform value
    platform = platforms[platform] == undefined ? 'Mobile' : platform // use Mobile if mapping fails
  }

  const semantic: Semantic = {
    name: sanitizeName(name),
    density: (density + 'Density') as Density, //density = 'regular' + append 'Density'
    platform: platforms[platform],
    size: sizes[style.fontSize],
    weight: weights[style.fontName.style],
    lineHeight: lineHeightsPxToTokens[style.lineHeight['value']],
    letterSpacing: letterSpacing(style.letterSpacing.value),
  }
  styles.push(semantic)
}

for (const index in styles) {
  const style = styles[index]
  const definition = {
    [style.density]: {
      [style.platform]: {
        size: { value: `{typography.tokens.sizes.${style.size}.value}` },
        weight: { value: `{typography.semantics.weights.${style.weight}.value}` },
        lineHeight: { value: `{typography.tokens.lineHeights.${style.lineHeight}.value}` },
        letterSpacing: { value: `{typography.tokens.letterSpacings.${style.letterSpacing}.value}` },
      },
    },
  }
  style.platform == platforms.Mobile ? (mobile[style.name] = definition) : (desktop[style.name] = definition)
}

const outputForUI = {
  themeName,
  density,
  fileName,
  json: {
    textStyle: {
      semantics: merge(mobile, desktop),
    },
  },
}

figma.showUI(__html__, { width: 400, height: 400 })
figma.ui.postMessage(JSON.stringify(outputForUI))

// debugging output that will save time 'out in the field'
console.log('🛠 [Prism Tools] styles', styles)
console.log('🛠 [Prism Tools] outputForUI', outputForUI)
