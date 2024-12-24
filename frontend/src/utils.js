const randomHexColorGenerator = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
const browserMocks = {
  useMocks: true,
  settings: {
    Theme: "system",
    ApiKey: "MockedKey"
  },
  categories: [
    {
      "Color": "#B45237",
      "Name": "A.T.I.",
      "Key": "652dbca9-21a3-4f9d-b815-2debc9799555"
    },
    {
      "Color": "#0F877A",
      "Name": "Anatomie topografică și secțională",
      "Key": "a1ce2d30-4777-4e4a-bd07-2f269d4cd5fd"
    },
    {
      "Color": "#FB83B9",
      "Name": "Anatomia omului",
      "Key": "c672771e-a1fe-42b3-a896-3ed0719b9dd1",
      "Children": [
        {
          "Color": "#FB83B9",
          "Name": "Partea de sus",
          "Key": "70784449-28a4-46a0-9e33-b25024dd6072"
        },
        {
          "Color": "#FB83B9",
          "Name": "Partea de jos",
          "Key": "e8b427f2-fd94-446e-8e02-5d0a15f791b5"
        },
        {
          "Color": "#FB83B9",
          "Name": "Partea de stanga",
          "Key": "7fa44e91-6ea0-4f1b-8b2f-d6b913f3e09a"
        }
      ]
    },
    {
      "Color": "#8852C6",
      "Name": "Boli infecțioase tropicale",
      "Key": "10d762fd-c0d0-4051-8e1d-b254f17df0b0"
    },
    {
      "Color": "#3F727A",
      "Name": "Dermatologie",
      "Key": "d6e8447d-d980-4db4-8d04-bee70369d254",
      "Children": [
        {
          "Color": "#3F727A",
          "Name": "Maini",
          "Key": "5a5eb9a9-574c-4c89-97af-f90971111f0d"
        },
        {
          "Color": "#3F727A",
          "Name": "Picioare",
          "Key": "7e86421d-18a3-4c57-bdcc-52c0f7243b89"
        },
        {
          "Color": "#3F727A",
          "Name": "Fata",
          "Key": "96126c0d-a47a-43ac-a052-7d2b6fe42faf"
        }
      ]
    }
  ],
  labels: [
    {
      "Color": "#1bf747",
      "Name": "Easy",
      "Key": "4b467f94-143d-45b5-bbfb-d1d7409d0841"
    },
    {
      "Color": "#086CC2",
      "Name": "Medium",
      "Key": "cbd9ab6d-6631-457e-b44f-3ca722e721f6"
    },
    {
      "Color": "#ff0000",
      "Name": "Hard",
      "Key": "e70f99d8-e4fe-4b84-b303-5fe0c1f16dd9"
    }
  ],
  questions: [],
};

export {
  randomHexColorGenerator,
  browserMocks,
}