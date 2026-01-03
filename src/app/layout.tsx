import {SharedRootBody, SharedRootHead} from '../components/_/root-layout';
import {siteConfig} from '../siteConfig';

export default function RootLayout({children}: React.PropsWithChildren) {
  return (
    <html lang={siteConfig.languageCode} dir={siteConfig.isRTL ? 'rtl' : 'ltr'}>
      <head>
        <SharedRootHead />
      </head>
      <SharedRootBody>{children}</SharedRootBody>
    </html>
  );
}
