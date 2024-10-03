// from https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6#gistcomment-3585151
export const merge = (target, source) => {
    const result = Object.assign(Object.assign({}, target), source);
    const keys = Object.keys(result);
    for (const key of keys) {
        const tprop = target[key];
        const sprop = source[key];
        if (typeof tprop == 'object' && typeof sprop == 'object') {
            result[key] = merge(tprop, sprop);
        }
    }
    return result;
};
// round num to nearest multiple, i.e. 1.22 => 1.25
export const roundTo = (num, multiple) => multiple * Math.round(num / multiple);
// mappings from Figma to Prism Semantics
export const platforms = { Mobile: 'mobileWidth', Desktop: 'desktopWidth' };
// convert lineHeights in pixels to em, rounded by 0.125
export const lineHeightsToEm = (lineHeightInPx, sizeInPx) => roundTo(lineHeightInPx / sizeInPx, 0.125);
// map percentage range [-2, 2] to semantic range [400, 800]
export const letterSpacing = (percentage) => percentage * 100 + 600;
// convert string "Label 1 - Emphasis" => "Label1Emphasis"
export const sanitizeName = (name) => name.replace(/[^a-zA-Z0-9]/g, '');
// generate file name "Label 1 - Emphasis" => "label1-emphasis"
export const sanitizeFileName = (name) => name.replace(/[^a-zA-Z0-9]/g, '');
// check if fileName includes density type
export const hasDensityInFilename = (name) => name.match(/\b(Regular|Expanded|Dense)+/gi);
// check if fileName includes components value
export const hasComponentInFilename = (name) => name.match(/\b(Component)/gi);
// get themeName from fileName
export const themeName = (name) => name
    .match(/\b(CxDx|CAVx|MxTx)+/g)
    .map(theme => {
    const mapping = {
        CxDx: 'default',
        CAVx: 'caviar',
        MxTx: 'merchant',
    };
    return mapping[theme];
})
    .pop()
    .toLowerCase();
