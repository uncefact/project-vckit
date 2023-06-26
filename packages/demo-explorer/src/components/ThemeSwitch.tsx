import React from 'react'
import { Card, Checkbox, Radio } from 'antd'
import { useTheme } from '../context/ThemeProvider'

const themes = [
  {
    name: 'light',
    label: 'Light',
  },
  {
    name: 'dark',
    label: 'Dark',
  },
  {
    name: 'system',
    label: 'System',
  },
]

const ThemeSwitcher = () => {
  const { theme, switchTheme, isCompact, setIsCompact } = useTheme()
  return (
    <Card title="Theme">
      <Radio.Group value={theme} onChange={(e) => switchTheme(e.target.value)}>
        {themes.map((themeOptions) => {
          console.log(themeOptions, theme)

          return (
            <Radio key={themeOptions.name} value={themeOptions.name}>
              {themeOptions.label}
            </Radio>
          )
        })}
      </Radio.Group>
      <div>
        <Checkbox
          onChange={(e) => setIsCompact(e.target.checked)}
          checked={isCompact}
        >
          Compact
        </Checkbox>
      </div>
    </Card>
  )
}

export default ThemeSwitcher
