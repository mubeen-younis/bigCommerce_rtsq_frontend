import React, { useState, useEffect } from 'react';
import { List, Typography, Badge, Card, Avatar, Empty, Tag, Space } from 'antd';
import { CheckCircleOutlined, PauseCircleOutlined, TruckOutlined, ShoppingOutlined } from '@ant-design/icons';
import FreightProvidersSkeleton from '../SkeletonLoader/FreightProvidersSkeleton';

const { Title, Text } = Typography;

const ProviderComponent = ({ installedCarriers, handleProviderServices, filterProvider, loading = false }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for skeleton effect
    if (!loading && installedCarriers) {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [installedCarriers, loading]);

  const handleProviderClick = (carrierSlug) => {
    handleProviderServices(carrierSlug);
  };

  // Filter providers into different categories (combining LTL and Parcel providers)
  const installedProviders = installedCarriers?.filter(carrier => carrier.is_enabled === 1) || [];
  const deactivatedProviders = installedCarriers?.filter(carrier => carrier.is_enabled === 0) || [];
  const allProviders = installedCarriers || [];

  const getProviderIcon = (carrierType) => {
    return carrierType === 1 ? <TruckOutlined /> : <ShoppingOutlined />;
  };

  const getProviderTypeLabel = (carrierType) => {
    return carrierType === 1 ? 'LTL Freight' : 'Parcel & Postal';
  };

  const getStatusColor = (isEnabled) => {
    return isEnabled === 1 ? '#52c41a' : '#ff4d4f';
  };

  const renderProviderItem = (carrier, showStatus = false) => {
    const isSelected = filterProvider === carrier?.slug;
    
    return (
      <List.Item
        key={carrier?.slug}
        onClick={() => handleProviderClick(carrier?.slug)}
        style={{
          cursor: 'pointer',
          padding: '16px 20px',
          borderRadius: '8px',
          margin: '8px 0',
          transition: 'all 0.3s ease',
          backgroundColor: isSelected ? '#e6f7ff' : 'transparent',
          border: isSelected ? '2px solid #1890ff' : '1px solid transparent',
          boxShadow: isSelected ? '0 4px 12px rgba(24, 144, 255, 0.15)' : 'none'
        }}
        className={isSelected ? 'selected-provider' : ''}
      >
        <List.Item.Meta
          avatar={
            <Avatar 
              size={48} 
              style={{ 
                backgroundColor: getStatusColor(carrier.is_enabled),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              icon={getProviderIcon(carrier.carrier_type)}
            />
          }
          title={
            <Space>
              <Text strong style={{ fontSize: '16px', color: '#262626' }}>
                {carrier.name}
              </Text>
              {showStatus && (
                <Tag 
                  color={carrier.is_enabled === 1 ? 'success' : 'error'}
                  icon={carrier.is_enabled === 1 ? <CheckCircleOutlined /> : <PauseCircleOutlined />}
                >
                  {carrier.is_enabled === 1 ? 'Enabled' : 'Disabled'}
                </Tag>
              )}
            </Space>
          }
          description={
            <Space direction="vertical" size={4}>
              <Tag color="blue" style={{ marginLeft: 0 }}>
                {getProviderTypeLabel(carrier.carrier_type)}
              </Tag>
              {showStatus && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Status: {carrier.is_enabled === 1 ? 'Active and ready to use' : 'Currently deactivated'}
                </Text>
              )}
            </Space>
          }
        />
      </List.Item>
    );
  };

  const renderSkeleton = (items = 3, title = "Providers") => (
    <FreightProvidersSkeleton rows={items} title={title} />
  );

  const renderSection = (title, data, showStatus = false, emptyMessage, badgeColor) => {
    if (isLoading) {
      return renderSkeleton(3, title);
    }

    return (
      <Card
        style={{
          marginBottom: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #f0f0f0'
        }}
        bodyStyle={{ padding: '0' }}
      >
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #f0f0f0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px 12px 0 0'
        }}>
          <Space align="center">
            <Title level={4} style={{ margin: 0, color: '#fff' }}>
              {title}
            </Title>
            <Badge
              count={data.length}
              style={{ backgroundColor: badgeColor }}
              showZero
            />
          </Space>
        </div>

        {data.length > 0 ? (
          <List
            dataSource={data}
            renderItem={(carrier) => renderProviderItem(carrier, showStatus)}
            style={{ padding: '8px' }}
          />
        ) : (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <Empty
              description={
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  {emptyMessage}
                </Text>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}
      </Card>
    );
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Installed Providers Section */}
        {renderSection(
          'Installed Providers',
          installedProviders,
          false,
          'No installed providers (LTL & Parcel)',
          '#52c41a'
        )}

        {/* Deactivated Providers Section */}
        {renderSection(
          'Deactivated Providers',
          deactivatedProviders,
          false,
          'No deactivated providers (LTL & Parcel)',
          '#ff4d4f'
        )}

        {/* All Providers Section */}
        {renderSection(
          'All Providers',
          allProviders,
          true,
          'No providers available',
          '#1890ff'
        )}
      </div>
    </div>
  );
};

export default ProviderComponent;
