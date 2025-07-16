import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { theme } from '../../theme';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  style?: ViewStyle;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name = '',
  size = 'md',
  style,
  showOnlineStatus = false,
  isOnline = false,
}) => {
  const avatarSize = theme.spacing.avatar[size];
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const avatarStyle = [
    styles.avatar,
    {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
    },
    style,
  ];

  const statusSize = avatarSize * 0.25;
  const statusStyle = {
    width: statusSize,
    height: statusSize,
    borderRadius: statusSize / 2,
    backgroundColor: isOnline ? theme.colors.chat.online : theme.colors.chat.offline,
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: theme.colors.background.primary,
  };

  return (
    <View style={[avatarStyle, { position: 'relative' }]}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={[avatarStyle, { margin: 0 }]}
          resizeMode="cover"
        />
      ) : (
        <View style={[avatarStyle, styles.placeholder, { margin: 0 }]}>
          <Text style={[styles.initials, { fontSize: avatarSize * 0.4 }]}>
            {initials}
          </Text>
        </View>
      )}
      
      {showOnlineStatus && (
        <View style={statusStyle} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    overflow: 'hidden',
  },
  placeholder: {
    backgroundColor: theme.colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: theme.colors.primary[600],
    fontWeight: '600',
  },
});
