export const getModalOverlayStyle = (isMobile) =>
	isMobile
		? {
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				width: '100vw',
				height: '100vh',
				background: '#fff',
				zIndex: 9999,
				display: 'flex',
				flexDirection: 'column',
			}
		: {
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				background: 'rgba(0,0,0,0.3)',
				zIndex: 1000,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			};

export const getModalContentStyle = (
	isMobile,
	{
		desktopWidth = 550,
		desktopHeight = 550,
		desktopBorderRadius = 10,
		desktopMaxWidth,
		desktopMaxHeight,
		desktopPadding = 20,
	} = {},
) =>
	isMobile
		? {
				background: '#fff',
				borderRadius: 0,
				height: '100vh',
				width: '100vw',
				padding: '16px 16px',
				display: 'flex',
				flexDirection: 'column',
				boxShadow: 'none',
				border: 'none',
				position: 'absolute',
				top: 0,
				left: 0,
			}
		: {
				background: '#fff',
				borderRadius: desktopBorderRadius,
				padding: desktopPadding,
				width: desktopWidth,
				height: desktopHeight,
				...(desktopMaxWidth && { maxWidth: desktopMaxWidth }),
				...(desktopMaxHeight && { maxHeight: desktopMaxHeight }),
				boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
			};
