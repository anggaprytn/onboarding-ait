import React, { memo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Props {
  width?: number;
  height?: number;
  fill?: string;
}

const MemoizedSvgComponent: React.FC<Props> = memo(
  ({ width = 31, height = 41, fill = '#1D4ED8' }) => {
    return (
      <View style={{ width, height }}>
        <Svg width={width} height={height} viewBox="0 0 31 41" fill="none">
          <Path
            d="M0 0H31V38.998C31 40.2803 29.8103 41.2314 28.5595 40.9489L15.9405 38.0995C15.6505 38.034 15.3495 38.034 15.0595 38.0995L2.44052 40.9489C1.18972 41.2314 0 40.2803 0 38.998V0Z"
            fill={fill}
          />
        </Svg>
      </View>
    );
  },
);

export default MemoizedSvgComponent;
