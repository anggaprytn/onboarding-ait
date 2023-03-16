import React, { memo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Props {
  width?: number;
  height?: number;
  fill?: string;
}

const MemoizedSvgComponent: React.FC<Props> = memo(
  ({ width = 16, height = 14, fill = '#F64056' }) => {
    return (
      <View style={{ width, height }}>
        <Svg width={width} height={height} viewBox="0 0 16 14" fill="none">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.17157 1.17157C2.73367 -0.390524 5.26633 -0.390524 6.82843 1.17157L8 2.34315L9.17157 1.17157C10.7337 -0.390524 13.2663 -0.390524 14.8284 1.17157C16.3905 2.73367 16.3905 5.26633 14.8284 6.82843L8 13.6569L1.17157 6.82843C-0.390524 5.26633 -0.390524 2.73367 1.17157 1.17157Z"
            fill={fill}
          />
        </Svg>
      </View>
    );
  },
);

export default MemoizedSvgComponent;
