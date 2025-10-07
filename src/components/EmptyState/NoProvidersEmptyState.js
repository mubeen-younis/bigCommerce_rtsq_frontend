import React from 'react';

const NoProvidersEmptyState = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
        minHeight: '300px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '40px 80px',
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          border: '1px solid #f0f0f0',
        }}
      >
        {/* Document Icon */}
        <div style={{ marginBottom: '32px' }}>
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'inline-block' }}
          >
            {/* Document background */}
            <rect
              x="25"
              y="15"
              width="70"
              height="90"
              rx="4"
              fill="#f7f7f7"
              stroke="#e0e0e0"
              strokeWidth="2"
            />
            {/* Folded corner */}
            <path
              d="M 95 15 L 95 35 L 75 35 Z"
              fill="#e8e8e8"
              stroke="#e0e0e0"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Yellow square in top left */}
            <rect
              x="35"
              y="30"
              width="16"
              height="16"
              rx="2"
              fill="#ffc107"
            />
            {/* Text lines */}
            <rect x="35" y="52" width="50" height="3" rx="1.5" fill="#d0d0d0" />
            <rect x="35" y="60" width="45" height="3" rx="1.5" fill="#d0d0d0" />
            <rect x="35" y="68" width="50" height="3" rx="1.5" fill="#d0d0d0" />
            <rect x="35" y="76" width="40" height="3" rx="1.5" fill="#d0d0d0" />
            <rect x="35" y="84" width="48" height="3" rx="1.5" fill="#d0d0d0" />
          </svg>
        </div>

        {/* Main heading */}
        <h3
          style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#262626',
            margin: '0 0 12px 0',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            letterSpacing: '-0.01em',
          }}
        >
          No providers installed
        </h3>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '14px',
            color: '#8c8c8c',
            margin: '0',
            lineHeight: '1.6',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          Add one from the list of available providers below.
        </p>
      </div>
    </div>
  );
};

export default NoProvidersEmptyState;
