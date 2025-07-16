import { TextStyle } from 'react-native';

export const typography = {
  // Font families
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  },
  
  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line heights
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Text styles
  styles: {
    // Headings
    h1: {
      fontSize: 30,
      fontWeight: 'bold',
      lineHeight: 36,
    } as TextStyle,
    
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 30,
    } as TextStyle,
    
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 26,
    } as TextStyle,
    
    h4: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
    } as TextStyle,
    
    // Body text
    body: {
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: 24,
    } as TextStyle,
    
    bodySmall: {
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: 20,
    } as TextStyle,
    
    // Special text
    caption: {
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: 16,
    } as TextStyle,
    
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 20,
    } as TextStyle,
    
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 18,
    } as TextStyle,
    
    label: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 18,
    } as TextStyle,
    
    // Chat specific
    chatMessage: {
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: 22,
    } as TextStyle,
    
    chatTime: {
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: 16,
    } as TextStyle,
    
    chatName: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 18,
    } as TextStyle,
  },
};
