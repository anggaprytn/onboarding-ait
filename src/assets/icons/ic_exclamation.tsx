import * as React from 'react';
import Svg, {
  SvgProps,
  G,
  Circle,
  Path,
  Defs,
  ClipPath,
} from 'react-native-svg';
import { memo } from 'react';

interface CustomSvgProps extends SvgProps {
  xmlns?: string;
}

const SvgComponent = (props: CustomSvgProps) => (
  <Svg
    width={56}
    height={56}
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G clipPath="url(#a)">
      <Circle cx={28.5} cy={28} r={28} fill="#FFE6E9" />
      <Path fill="#fff" d="M16.5 13h24v30h-24z" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M49.5 28c0 11.598-9.402 21-21 21s-21-9.402-21-21 9.402-21 21-21 21 9.402 21 21ZM31.125 38.5a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0ZM28.5 14.875a2.625 2.625 0 0 0-2.625 2.625V28a2.625 2.625 0 0 0 5.25 0V17.5a2.625 2.625 0 0 0-2.625-2.625Z"
        fill="#E91639"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" transform="translate(.5)" d="M0 0h56v56H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

const Memo = memo(SvgComponent);
export default Memo;
