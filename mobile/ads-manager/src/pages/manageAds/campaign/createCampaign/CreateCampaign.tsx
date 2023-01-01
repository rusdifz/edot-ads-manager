import React, { useState } from 'react';
import { View } from 'react-native';
import ProgressBar from '../../manageAds.fragments/ProgressBar';
import Campaign from './createCampaign.fragments/Campaign';
import Content from './createCampaign.fragments/Content';
import PublishCampaign from './createCampaign.fragments/PublishCampaign';
import TargetAudience from './createCampaign.fragments/TargetAudience';
import createCampaignStyles from './createCampaign.styles';

const CreateCampaign = () => {
  const [stepNumber, setStepNumber] = useState(1);
  return (
    <View style={createCampaignStyles.container}>
      <ProgressBar
        maxValue={4}
        value={stepNumber}
        label={
          stepNumber === 1
            ? 'Campaign'
            : stepNumber === 2
            ? 'Target Audience'
            : stepNumber === 3
            ? 'Content'
            : 'Publish Campaign'
        }
      />
      {stepNumber === 1 ? (
        <Campaign onPressNext={() => setStepNumber(2)} />
      ) : stepNumber === 2 ? (
        <TargetAudience onPressNext={() => setStepNumber(3)} />
      ) : stepNumber === 3 ? (
        <Content onPressNext={() => setStepNumber(4)} />
      ) : (
        <PublishCampaign />
      )}
    </View>
  );
};

export default CreateCampaign;
