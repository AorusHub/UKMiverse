import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const RoleBasedComponent = ({ 
  children, 
  allowedRoles = [], 
  fallback = null,
  requireAuth = true 
}) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  // Show loading if still checking authentication
  if (loading) {
    return null;
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return fallback;
  }

  // If no roles specified, just check authentication
  if (allowedRoles.length === 0) {
    return isAuthenticated ? children : fallback;
  }

  // Check if user has any of the allowed roles
  // Support both string roles and numeric role IDs
  const hasAllowedRole = user && allowedRoles.some(role => {
    if (typeof role === 'string') {
      // Handle string roles like 'admin', 'user'
      return user.role === role || 
             user.role_name === role || 
             (user.role && user.role.name === role);
    } else {
      // Handle numeric role IDs like 1 (admin), 2 (user) - exact match only
      // Try user.role_id first, then fallback to user.role.id
      const userRoleId = user.role_id || (user.role && user.role.id);
      return userRoleId === role;
    }
  });

  return hasAllowedRole ? children : fallback;
};

export default RoleBasedComponent;
