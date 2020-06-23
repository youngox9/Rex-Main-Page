import React, { useState, useEffect } from 'react';

import { Stage, Sprite, Container } from '@inlet/react-pixi';

import path from 'path';
import data from '~~/data.json';
import ImageSprite from '~~components/ImageSprite';

function App(props) {
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(data);
  }, []);

  return (
    <div>
      <Stage>
        <Container width={1200}>
          {
            data.map((obj) => {
              const { bg } = obj;
              return <ImageSprite image={bg} x={100} y={100} width={0.3} />;
            })
          }
        </Container>
      </Stage>
    </div>
  );
}

export default App;
