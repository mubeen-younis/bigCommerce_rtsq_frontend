import React, { useState, useEffect } from 'react';
import { Button, Space } from 'antd';
import FreightProvidersSkeleton from './FreightProvidersSkeleton';

const FreightProvidersSkeletonExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMultiple, setShowMultiple] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000); // 3 second loading simulation
  };

  const toggleMultipleSections = () => {
    setShowMultiple(!showMultiple);
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <Space>
            <Button type="primary" onClick={simulateLoading}>
              {isLoading ? 'Loading...' : 'Simulate Loading'}
            </Button>
            <Button onClick={toggleMultipleSections}>
              {showMultiple ? 'Show Single' : 'Show Multiple Sections'}
            </Button>
          </Space>
        </div>

        {/* Example 1: Single section with default 5 rows */}
        {!showMultiple && (
          <FreightProvidersSkeleton
            title="Freight Providers"
            rows={isLoading ? 5 : 0}
          />
        )}

        {/* Example 2: Multiple sections */}
        {showMultiple && (
          <>
            <FreightProvidersSkeleton
              title="LTL Freight Providers"
              rows={isLoading ? 3 : 0}
            />
            <FreightProvidersSkeleton
              title="Parcel & Postal Providers"
              rows={isLoading ? 4 : 0}
            />
            <FreightProvidersSkeleton
              title="Add-ons"
              rows={isLoading ? 2 : 0}
            />
          </>
        )}

        {/* Show this when not loading */}
        {!isLoading && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3>Content Loaded!</h3>
            <p>This is where your actual freight provider data would appear.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreightProvidersSkeletonExample;