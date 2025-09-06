import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ComposePost = ({ onPost, onClose }) => {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('text');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [timeframe, setTimeframe] = useState('1D');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [hashtags, setHashtags] = useState('');
  const fileInputRef = useRef(null);

  const postTypeOptions = [
    { value: 'text', label: 'Текстовый пост' },
    { value: 'chart', label: 'Анализ графика' },
    { value: 'prediction', label: 'Прогноз' },
    { value: 'educational', label: 'Обучение' }
  ];

  const symbolOptions = [
    { value: 'BTCUSD', label: 'Bitcoin (BTC/USD)' },
    { value: 'ETHUSD', label: 'Ethereum (ETH/USD)' },
    { value: 'AAPL', label: 'Apple Inc. (AAPL)' },
    { value: 'GOOGL', label: 'Alphabet Inc. (GOOGL)' },
    { value: 'TSLA', label: 'Tesla Inc. (TSLA)' },
    { value: 'MSFT', label: 'Microsoft Corp. (MSFT)' },
    { value: 'NVDA', label: 'NVIDIA Corp. (NVDA)' },
    { value: 'AMZN', label: 'Amazon.com Inc. (AMZN)' }
  ];

  const timeframeOptions = [
    { value: '1m', label: '1 минута' },
    { value: '5m', label: '5 минут' },
    { value: '15m', label: '15 минут' },
    { value: '1h', label: '1 час' },
    { value: '4h', label: '4 часа' },
    { value: '1D', label: '1 день' },
    { value: '1W', label: '1 неделя' },
    { value: '1M', label: '1 месяц' }
  ];

  const handleImageUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e?.target?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!content?.trim()) return;

    const hashtagArray = hashtags?.split(' ')?.filter(tag => tag?.startsWith('#'))?.map(tag => tag?.slice(1));
    
    const postData = {
      content: content?.trim(),
      type: postType,
      hashtags: hashtagArray,
      image: uploadedImage,
      timestamp: new Date()?.toISOString()
    };

    if (postType === 'chart' || postType === 'prediction') {
      postData.symbol = selectedSymbol;
      postData.timeframe = timeframe;
    }

    if (postType === 'prediction') {
      postData.targetPrice = parseFloat(targetPrice);
      postData.stopLoss = parseFloat(stopLoss);
    }

    onPost(postData);
    
    // Reset form
    setContent('');
    setPostType('text');
    setSelectedSymbol('');
    setTargetPrice('');
    setStopLoss('');
    setTimeframe('1D');
    setUploadedImage(null);
    setHashtags('');
  };

  const renderTypeSpecificFields = () => {
    if (postType === 'chart' || postType === 'prediction') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Инструмент"
              options={symbolOptions}
              value={selectedSymbol}
              onChange={setSelectedSymbol}
              searchable
              placeholder="Выберите инструмент"
            />
            <Select
              label="Таймфрейм"
              options={timeframeOptions}
              value={timeframe}
              onChange={setTimeframe}
              placeholder="Выберите таймфрейм"
            />
          </div>
          {postType === 'prediction' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Целевая цена
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e?.target?.value)}
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Стоп-лосс
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e?.target?.value)}
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Создать пост</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {/* Post Type Selection */}
        <Select
          label="Тип поста"
          options={postTypeOptions}
          value={postType}
          onChange={setPostType}
          placeholder="Выберите тип поста"
        />

        {/* Type-specific fields */}
        {renderTypeSpecificFields()}

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Содержание
          </label>
          <textarea
            placeholder="Поделитесь своими мыслями о рынке..."
            value={content}
            onChange={(e) => setContent(e?.target?.value)}
            rows={4}
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {content?.length}/500 символов
            </span>
          </div>
        </div>

        {/* Hashtags */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Хештеги
          </label>
          <input
            type="text"
            placeholder="#торговля #анализ #крипто"
            value={hashtags}
            onChange={(e) => setHashtags(e?.target?.value)}
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Image Upload */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          
          {uploadedImage ? (
            <div className="relative">
              <Image 
                src={uploadedImage} 
                alt="Загруженное изображение"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setUploadedImage(null)}
                className="absolute top-2 right-2"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => fileInputRef?.current?.click()}
              className="w-full flex items-center justify-center space-x-2 py-8 border-dashed"
            >
              <Icon name="ImagePlus" size={20} />
              <span>Добавить изображение</span>
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef?.current?.click()}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <Icon name="Image" size={16} />
              <span>Фото</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <Icon name="BarChart3" size={16} />
              <span>График</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <Icon name="Hash" size={16} />
              <span>Хештег</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Отмена
              </Button>
            )}
            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={!content?.trim()}
            >
              Опубликовать
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposePost;