import NextNProgress from 'nextjs-progressbar';

export function NProgressBar() {
  return (
    <NextNProgress
      height={4}
      color="#149eca"
      options={{
        showSpinner: false,
      }}
      transformCSS={(css) => {
        return <style>{css.replace(/\s+/g, ' ').trim()}</style>;
      }}
    />
  );
}
