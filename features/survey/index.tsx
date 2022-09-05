//@GSUpro remove survey dialogue
// import React from 'react'

// import { SurveyButtons } from './SurveyButtons'
//@GSUpro remove survey dialogue end
import surveysConfig from './surveysConfig.json'

export function Survey({ for: page }: { for: keyof typeof surveysConfig }) {
  const config = surveysConfig[page]

  //@GSUpro remove survey dialogue
  return config.id && null
  //@GSUpro remove survey dialogue end
}
