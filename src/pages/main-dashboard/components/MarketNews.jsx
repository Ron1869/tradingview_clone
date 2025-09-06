import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const MarketNews = () => {
  const [selectedTab, setSelectedTab] = useState('news');

  const mockNewsData = {
    news: [
      {
        id: "NEWS001",
        title: "Bitcoin Reaches New All-Time High Above $67,000",
        summary: "Bitcoin surged to a new record high today, driven by institutional adoption and positive regulatory developments in major markets.",
        source: "CryptoNews",
        time: "2 hours ago",
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=200&fit=crop",
        category: "Market",
        sentiment: "bullish"
      },
      {
        id: "NEWS002", 
        title: "Ethereum 2.0 Staking Rewards Hit Record Levels",
        summary: "Ethereum staking yields have reached unprecedented levels as network activity continues to grow exponentially.",
        source: "BlockchainDaily",
        time: "4 hours ago",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop",
        category: "Technology",
        sentiment: "bullish"
      },
      {
        id: "NEWS003",
        title: "Major Bank Announces Crypto Trading Services",
        summary: "One of the world\'s largest banks has officially launched cryptocurrency trading services for institutional clients.",
        source: "FinanceToday",
        time: "6 hours ago", 
        image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop",
        category: "Adoption",
        sentiment: "bullish"
      },
      {
        id: "NEWS004",
        title: "Regulatory Clarity Boosts Market Confidence",
        summary: "New regulatory guidelines provide much-needed clarity for cryptocurrency operations in key jurisdictions.",
        source: "RegulatoryWatch",
        time: "8 hours ago",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
        category: "Regulation",
        sentiment: "bullish"
      }
    ],
    social: [
      {
        id: "SOCIAL001",
        author: "CryptoTrader_Pro",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        content: "Just spotted a massive bullish divergence on the 4H chart. This could be the breakout we've been waiting for! 🚀\n\nTargets:\n- First resistance: $68,500\n- Major resistance: $72,000\n\nWhat do you think?",
        time: "1 hour ago",
        likes: 234,
        comments: 45,
        shares: 12,
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
        tags: ["#Bitcoin", "#TechnicalAnalysis", "#Bullish"]
      },
      {
        id: "SOCIAL002",
        author: "MarketAnalyst_Jane",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg", 
        content: "Ethereum is showing incredible strength! The fundamentals are solid and the technicals are aligning perfectly.\n\nKey levels to watch:\n- Support: $3,400\n- Resistance: $3,600\n\nLong-term outlook remains very positive! 📈",
        time: "2 hours ago",
        likes: 189,
        comments: 32,
        shares: 8,
        tags: ["#Ethereum", "#Analysis", "#Crypto"]
      },
      {
        id: "SOCIAL003",
        author: "DeFi_Researcher",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
        content: "New DeFi protocol just launched with some interesting yield farming opportunities. DYOR but the tokenomics look solid.\n\nAPY ranges from 15-45% depending on the pool. Risk assessment in comments below.",
        time: "3 hours ago",
        likes: 156,
        comments: 67,
        shares: 23,
        tags: ["#DeFi", "#YieldFarming", "#Research"]
      },
      {
        id: "SOCIAL004",
        author: "BlockchainDev",
        avatar: "https://randomuser.me/api/portraits/women/28.jpg",
        content: "Smart contract audit results are in! Found 2 minor issues that have been fixed. The protocol is now ready for mainnet deployment.\n\nSecurity should always be the top priority in DeFi. 🔒",
        time: "5 hours ago",
        likes: 98,
        comments: 21,
        shares: 15,
        tags: ["#Security", "#SmartContracts", "#Audit"]
      }
    ]
  };

  const currentData = mockNewsData?.[selectedTab];

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return 'text-success';
      case 'bearish': return 'text-error';
      case 'neutral': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Market': return 'bg-primary/10 text-primary';
      case 'Technology': return 'bg-success/10 text-success';
      case 'Regulation': return 'bg-warning/10 text-warning';
      case 'Adoption': return 'bg-accent/10 text-accent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleLike = (id) => {
    console.log('Liked post:', id);
  };

  const handleComment = (id) => {
    console.log('Comment on post:', id);
  };

  const handleShare = (id) => {
    console.log('Share post:', id);
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">Market Feed</h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="Rss"
            className="text-muted-foreground hover:text-foreground"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1">
          {[
            { key: 'news', label: 'News', icon: 'Newspaper' },
            { key: 'social', label: 'Social', icon: 'MessageSquare' }
          ]?.map((tab) => (
            <button
              key={tab?.key}
              onClick={() => setSelectedTab(tab?.key)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-smooth ${
                selectedTab === tab?.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab?.icon} size={14} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedTab === 'news' ? (
          // News Feed
          (<div className="space-y-4 p-4">
            {mockNewsData?.news?.map((article) => (
              <div
                key={article?.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-smooth cursor-pointer"
              >
                <div className="flex space-x-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={article?.image}
                      alt={article?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article?.category)}`}>
                        {article?.category}
                      </span>
                      <span className={`text-xs font-medium ${getSentimentColor(article?.sentiment)}`}>
                        {article?.sentiment?.toUpperCase()}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">
                      {article?.title}
                    </h4>
                    
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {article?.summary}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{article?.source}</span>
                      <span>{article?.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>)
        ) : (
          // Social Feed
          (<div className="space-y-4 p-4">
            {mockNewsData?.social?.map((post) => (
              <div
                key={post?.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-smooth"
              >
                {/* Author Info */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={post?.avatar}
                      alt={post?.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{post?.author}</div>
                    <div className="text-xs text-muted-foreground">{post?.time}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-3">
                  <p className="text-sm text-foreground whitespace-pre-line mb-2">
                    {post?.content}
                  </p>
                  
                  {post?.image && (
                    <div className="w-full h-32 rounded-lg overflow-hidden mt-3">
                      <Image
                        src={post?.image}
                        alt="Post image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {post?.tags && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post?.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs text-primary hover:text-primary/80 cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-6 text-muted-foreground">
                  <button
                    onClick={() => handleLike(post?.id)}
                    className="flex items-center space-x-2 hover:text-error transition-smooth"
                  >
                    <Icon name="Heart" size={16} />
                    <span className="text-xs">{post?.likes}</span>
                  </button>
                  
                  <button
                    onClick={() => handleComment(post?.id)}
                    className="flex items-center space-x-2 hover:text-primary transition-smooth"
                  >
                    <Icon name="MessageCircle" size={16} />
                    <span className="text-xs">{post?.comments}</span>
                  </button>
                  
                  <button
                    onClick={() => handleShare(post?.id)}
                    className="flex items-center space-x-2 hover:text-success transition-smooth"
                  >
                    <Icon name="Share" size={16} />
                    <span className="text-xs">{post?.shares}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>)
        )}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          iconName="ExternalLink"
          iconPosition="right"
          onClick={() => window.location.href = '/social-trading-feed'}
        >
          {selectedTab === 'news' ? 'View All News' : 'Join Social Feed'}
        </Button>
      </div>
    </div>
  );
};

export default MarketNews;