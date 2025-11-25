import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { User } from '@/types';

try {
  WebBrowser.maybeCompleteAuthSession();
} catch (e) {
  // Web platform may not support this
}

let redirectUri = '';
try {
  redirectUri = AuthSession.makeRedirectUri({
    native: 'fstservis://oauth-callback',
    web: `${process.env.EXPO_PUBLIC_REDIRECT_URL || 'http://localhost:8081'}/oauth-callback`,
  });
} catch (e) {
  redirectUri = `${process.env.EXPO_PUBLIC_REDIRECT_URL || 'http://localhost:8081'}/oauth-callback`;
}

// Google OAuth
const googleConfig = {
  clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
  redirectUri,
  scopes: ['openid', 'profile', 'email'],
  discovery: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  },
};

// Facebook OAuth
const facebookConfig = {
  clientId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '',
  redirectUri,
  scopes: ['public_profile', 'email'],
  discovery: {
    authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token',
  },
};

// GitHub OAuth
const githubConfig = {
  clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID || '',
  redirectUri,
  scopes: ['user:email'],
  discovery: {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
  },
};

// X (Twitter) OAuth
const xConfig = {
  clientId: process.env.EXPO_PUBLIC_X_CLIENT_ID || '',
  redirectUri,
  scopes: ['tweet.read', 'users.read'],
  discovery: {
    authorizationEndpoint: 'https://twitter.com/i/oauth2/authorize',
    tokenEndpoint: 'https://twitter.com/2/oauth2/token',
  },
};

// Instagram OAuth
const instagramConfig = {
  clientId: process.env.EXPO_PUBLIC_INSTAGRAM_APP_ID || '',
  redirectUri,
  scopes: ['user_profile', 'user_media'],
  discovery: {
    authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
    tokenEndpoint: 'https://graph.instagram.com/v18.0/access_token',
  },
};

// Demo fallback users for OAuth (when real OAuth fails)
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
    if (!googleConfig.clientId) {
      return demoOAuthUsers.google;
    }

    const request = new AuthSession.AuthRequest({
      clientId: googleConfig.clientId,
      redirectUri: googleConfig.redirectUri,
      scopes: googleConfig.scopes,
      discovery: googleConfig.discovery,
    });

    const result = await request.promptAsync(googleConfig.discovery);

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
    if (!facebookConfig.clientId) {
      return demoOAuthUsers.facebook;
    }

    const request = new AuthSession.AuthRequest({
      clientId: facebookConfig.clientId,
      redirectUri: facebookConfig.redirectUri,
      scopes: facebookConfig.scopes,
      discovery: facebookConfig.discovery,
    });

    const result = await request.promptAsync(facebookConfig.discovery);

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
    if (!githubConfig.clientId) {
      return demoOAuthUsers.github;
    }

    const request = new AuthSession.AuthRequest({
      clientId: githubConfig.clientId,
      redirectUri: githubConfig.redirectUri,
      scopes: githubConfig.scopes,
      discovery: githubConfig.discovery,
    });

    const result = await request.promptAsync(githubConfig.discovery);

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
    if (!xConfig.clientId) {
      return demoOAuthUsers.x;
    }

    const request = new AuthSession.AuthRequest({
      clientId: xConfig.clientId,
      redirectUri: xConfig.redirectUri,
      scopes: xConfig.scopes,
      discovery: xConfig.discovery,
    });

    const result = await request.promptAsync(xConfig.discovery);

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
    if (!instagramConfig.clientId) {
      return demoOAuthUsers.instagram;
    }

    const request = new AuthSession.AuthRequest({
      clientId: instagramConfig.clientId,
      redirectUri: instagramConfig.redirectUri,
      scopes: instagramConfig.scopes,
      discovery: instagramConfig.discovery,
    });

    const result = await request.promptAsync(instagramConfig.discovery);

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
