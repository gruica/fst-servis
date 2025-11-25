import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { User } from '@/types';

WebBrowser.maybeCompleteAuthSession();

const redirectUrl = AuthSession.makeRedirectUrl({
  native: 'fstservis://oauth-callback',
  web: `${process.env.EXPO_PUBLIC_REDIRECT_URL || 'http://localhost:8081'}/oauth-callback`,
});

// Google OAuth
const googleConfig = {
  clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET || '',
  redirectUrl,
  scopes: ['openid', 'profile', 'email'],
  discovery: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke?client_id=' + process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  },
};

// Facebook OAuth
const facebookConfig = {
  clientId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '',
  clientSecret: process.env.EXPO_PUBLIC_FACEBOOK_APP_SECRET || '',
  redirectUrl,
  scopes: ['public_profile', 'email'],
  discovery: {
    authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token',
  },
};

// GitHub OAuth
const githubConfig = {
  clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID || '',
  clientSecret: process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET || '',
  redirectUrl,
  scopes: ['user:email'],
  discovery: {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
  },
};

export async function loginWithGoogle(): Promise<User | null> {
  try {
    const request = new AuthSession.AuthRequest({
      clientId: googleConfig.clientId,
      redirectUrl: googleConfig.redirectUrl,
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
    return null;
  } catch (error) {
    console.error('Google login error:', error);
    return null;
  }
}

export async function loginWithFacebook(): Promise<User | null> {
  try {
    const request = new AuthSession.AuthRequest({
      clientId: facebookConfig.clientId,
      redirectUrl: facebookConfig.redirectUrl,
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
    return null;
  } catch (error) {
    console.error('Facebook login error:', error);
    return null;
  }
}

export async function loginWithGithub(): Promise<User | null> {
  try {
    const request = new AuthSession.AuthRequest({
      clientId: githubConfig.clientId,
      redirectUrl: githubConfig.redirectUrl,
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
    return null;
  } catch (error) {
    console.error('GitHub login error:', error);
    return null;
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
