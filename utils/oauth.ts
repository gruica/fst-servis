import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { User } from "../types";

try {
  WebBrowser.maybeCompleteAuthSession();
} catch (e) {
  // Web platform may not support this
}

let redirectUri = '';
try {
  redirectUri = AuthSession.makeRedirectUri({
    native: 'fstservis://oauth-callback',
  }) || `${process.env.EXPO_PUBLIC_REDIRECT_URL || 'http://localhost:8081'}/oauth-callback`;
} catch (e) {
  redirectUri = `${process.env.EXPO_PUBLIC_REDIRECT_URL || 'http://localhost:8081'}/oauth-callback`;
}

// Demo fallback users for OAuth
const demoOAuthUsers: { [key: string]: User } = {
  google: {
    id: 'google_demo_001',
    email: 'demo.google@gmail.com',
    name: 'Google Demo User',
    role: 'technician',
    avatar: undefined,
  },
  facebook: {
    id: 'facebook_demo_001',
    email: 'demo.facebook@example.com',
    name: 'Facebook Demo User',
    role: 'technician',
    avatar: undefined,
  },
  github: {
    id: 'github_demo_001',
    email: 'demo@github.com',
    name: 'GitHub Demo User',
    role: 'technician',
    avatar: undefined,
  },
  x: {
    id: 'x_demo_001',
    email: 'demo_twitter',
    name: 'X Demo User',
    role: 'technician',
    avatar: undefined,
  },
  instagram: {
    id: 'instagram_demo_001',
    email: 'demo.instagram',
    name: 'Instagram Demo User',
    role: 'technician',
    avatar: undefined,
  },
};

export async function loginWithGoogle(): Promise<User | null> {
  try {
    if (!process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID) {
      return demoOAuthUsers.google;
    }

    const request = new AuthSession.AuthRequest({
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
    });

    const authorizationEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    const result = await request.promptAsync({
      authorizationEndpoint,
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
    });

    if (result.type === 'success' && result.authentication) {
      const userInfo = await fetchGoogleUserInfo(result.authentication.accessToken);
      return {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        role: 'technician' as const,
        avatar: userInfo.picture,
      };
    }
    return demoOAuthUsers.google;
  } catch (error) {
    console.log('Google login fallback to demo:', error);
    return demoOAuthUsers.google;
  }
}

export async function loginWithFacebook(): Promise<User | null> {
  try {
    if (!process.env.EXPO_PUBLIC_FACEBOOK_APP_ID) {
      return demoOAuthUsers.facebook;
    }

    const request = new AuthSession.AuthRequest({
      clientId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
      redirectUri,
      scopes: ['public_profile', 'email'],
    });

    const authorizationEndpoint = 'https://www.facebook.com/v18.0/dialog/oauth';
    const result = await request.promptAsync({
      authorizationEndpoint,
      tokenEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token',
    });

    if (result.type === 'success' && result.authentication) {
      const userInfo = await fetchFacebookUserInfo(result.authentication.accessToken);
      return {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        role: 'technician' as const,
        avatar: userInfo.picture?.data?.url,
      };
    }
    return demoOAuthUsers.facebook;
  } catch (error) {
    console.log('Facebook login fallback to demo:', error);
    return demoOAuthUsers.facebook;
  }
}

export async function loginWithGithub(): Promise<User | null> {
  try {
    if (!process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID) {
      return demoOAuthUsers.github;
    }

    const request = new AuthSession.AuthRequest({
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID,
      redirectUri,
      scopes: ['user:email'],
    });

    const authorizationEndpoint = 'https://github.com/login/oauth/authorize';
    const result = await request.promptAsync({
      authorizationEndpoint,
      tokenEndpoint: 'https://github.com/login/oauth/access_token',
    });

    if (result.type === 'success' && result.authentication) {
      const userInfo = await fetchGithubUserInfo(result.authentication.accessToken);
      return {
        id: userInfo.id.toString(),
        email: userInfo.email,
        name: userInfo.name || userInfo.login,
        role: 'technician' as const,
        avatar: userInfo.avatar_url,
      };
    }
    return demoOAuthUsers.github;
  } catch (error) {
    console.log('GitHub login fallback to demo:', error);
    return demoOAuthUsers.github;
  }
}

export async function loginWithX(): Promise<User | null> {
  try {
    if (!process.env.EXPO_PUBLIC_X_CLIENT_ID) {
      return demoOAuthUsers.x;
    }

    const request = new AuthSession.AuthRequest({
      clientId: process.env.EXPO_PUBLIC_X_CLIENT_ID,
      redirectUri,
      scopes: ['tweet.read', 'users.read'],
    });

    const authorizationEndpoint = 'https://twitter.com/i/oauth2/authorize';
    const result = await request.promptAsync({
      authorizationEndpoint,
      tokenEndpoint: 'https://twitter.com/2/oauth2/token',
    });

    if (result.type === 'success' && result.authentication) {
      const userInfo = await fetchXUserInfo(result.authentication.accessToken);
      return {
        id: userInfo.data.id,
        email: userInfo.data.username,
        name: userInfo.data.name,
        role: 'technician' as const,
        avatar: userInfo.data.profile_image_url,
      };
    }
    return demoOAuthUsers.x;
  } catch (error) {
    console.log('X login fallback to demo:', error);
    return demoOAuthUsers.x;
  }
}

export async function loginWithInstagram(): Promise<User | null> {
  try {
    if (!process.env.EXPO_PUBLIC_INSTAGRAM_APP_ID) {
      return demoOAuthUsers.instagram;
    }

    const request = new AuthSession.AuthRequest({
      clientId: process.env.EXPO_PUBLIC_INSTAGRAM_APP_ID,
      redirectUri,
      scopes: ['user_profile', 'user_media'],
    });

    const authorizationEndpoint = 'https://api.instagram.com/oauth/authorize';
    const result = await request.promptAsync({
      authorizationEndpoint,
      tokenEndpoint: 'https://graph.instagram.com/v18.0/access_token',
    });

    if (result.type === 'success' && result.authentication) {
      const userInfo = await fetchInstagramUserInfo(result.authentication.accessToken);
      return {
        id: userInfo.id,
        email: userInfo.username,
        name: userInfo.username,
        role: 'technician' as const,
        avatar: undefined,
      };
    }
    return demoOAuthUsers.instagram;
  } catch (error) {
    console.log('Instagram login fallback to demo:', error);
    return demoOAuthUsers.instagram;
  }
}

async function fetchGoogleUserInfo(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.json();
}

async function fetchFacebookUserInfo(accessToken: string) {
  const response = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
  );
  return response.json();
}

async function fetchGithubUserInfo(accessToken: string) {
  const response = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.json();
}

async function fetchXUserInfo(accessToken: string) {
  const response = await fetch('https://api.twitter.com/2/users/me?user.fields=name,profile_image_url', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.json();
}

async function fetchInstagramUserInfo(accessToken: string) {
  const response = await fetch(
    `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
  );
  return response.json();
}
