import React from 'react';
import { Card, Typography } from 'antd';
import './FreightProvidersSkeleton.css';

const { Title } = Typography;

const FreightProvidersSkeleton = ({ rows = 5, title = "Freight Providers" }) => {
  return (
    <div className="freight-providers-skeleton">
      <Card
        style={{
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #f0f0f0'
        }}
        bodyStyle={{ padding: '0' }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
        </div>

        {/* Skeleton Rows */}
        <div style={{ padding: '8px' }}>
          {[...Array(rows)].map((_, index) => (
            <div key={index} className="skeleton-row">
              <div className="skeleton-row-content">
                {/* Logo placeholder */}
                <div className="skeleton-avatar shimmer"></div>

                {/* Content section */}
                <div className="skeleton-content">
                  {/* Provider name */}
                  <div className="skeleton-title shimmer"></div>
                  {/* Status/description */}
                  <div className="skeleton-description shimmer"></div>
                </div>

                {/* Button placeholder */}
                <div className="skeleton-button shimmer"></div>
              </div>

              {/* Bottom border */}
              {index < rows - 1 && <div className="skeleton-border"></div>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FreightProvidersSkeleton;