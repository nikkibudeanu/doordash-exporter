export type Density = 'regularDensity' | 'expandedDensity' | 'denseDensity'

export type Platform = 'mobile' | 'desktop'

export type Value = { name: string; value: string | number }

export type Semantic = {
  name: string
  density: Density
  platform: Platform
  size: Value
  weight: Value
  lineHeight: Value
  letterSpacing: number
}
