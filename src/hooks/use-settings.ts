import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { FarcasterManifestSchema } from '../utils/manifest';

interface WPSettings {
	farcaster_wp: {
		message: string;
		display: string;
		size: string;
		frames_enabled: boolean;
		splash_background_color: string;
		button_text: string;
		splash_image: {
			id: number;
			url: string;
		};
		fallback_image: {
			id: number;
			url: string;
		};
		use_title_as_button_text: boolean;
		domain_manifest: string;
	};
}

export const useSettings = () => {
	const [ domainManifest, setDomainManifest ] = useState< string >();
	const [ framesEnabled, setFramesEnabled ] = useState< boolean >();
	const [ splashBackgroundColor, setSplashBackgroundColor ] =
		useState< string >();
	const [ buttonText, setButtonText ] = useState< string >();
	const [ splashImage, setSplashImage ] = useState< {
		id: number;
		url: string;
	} >( {
		id: 0,
		url: '',
	} );
	const [ fallbackImage, setFallbackImage ] = useState< {
		id: number;
		url: string;
	} >( {
		id: 0,
		url: '',
	} );
	const [ useTitleAsButtonText, setUseTitleAsButtonText ] =
		useState< boolean >( false );
	const { createSuccessNotice, createErrorNotice } =
		useDispatch( noticesStore );

	useEffect( () => {
		apiFetch< WPSettings >( { path: '/wp/v2/settings' } ).then(
			( settings ) => {
				setFramesEnabled( settings.farcaster_wp.frames_enabled );
				setSplashBackgroundColor(
					settings.farcaster_wp.splash_background_color
				);
				setButtonText( settings.farcaster_wp.button_text );
				setSplashImage( settings.farcaster_wp.splash_image );
				setFallbackImage( settings.farcaster_wp.fallback_image );
				setUseTitleAsButtonText(
					settings.farcaster_wp.use_title_as_button_text
				);
				setDomainManifest( settings.farcaster_wp.domain_manifest );
			}
		);
	}, [] );

	const saveSettings = ( callback?: () => void ) => {
		// Hacky validation here to prevent saving invalid manifest.
		if ( domainManifest ) {
			let parsedDomainManifest = null;
			try {
				parsedDomainManifest = JSON.parse( domainManifest );
			} catch {}
			const result =
				FarcasterManifestSchema.safeParse( parsedDomainManifest );
			if ( ! result.success ) {
				createErrorNotice(
					__(
						'Did not save settings, domain manifest is invalid.',
						'farcaster-wp'
					)
				).then(
					() =>
						document.scrollingElement?.scrollTo( {
							top: 0,
							behavior: 'smooth',
						} )
				);
				return;
			}
		}

		apiFetch( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: {
				farcaster_wp: {
					frames_enabled: framesEnabled,
					splash_background_color: splashBackgroundColor,
					button_text: buttonText,
					splash_image: splashImage,
					fallback_image: fallbackImage,
					use_title_as_button_text: useTitleAsButtonText,
					domain_manifest: domainManifest,
				},
			},
		} )
			.then( () => {
				createSuccessNotice(
					__( 'Settings saved.', 'farcaster-wp' )
				).then( () => {
					if ( callback ) {
						callback();
					}
					document.scrollingElement?.scrollTo( {
						top: 0,
						behavior: 'smooth',
					} );
				} );
			} )
			.catch( ( error ) => {
				// eslint-disable-next-line no-console
				console.error( error );
				// @TODO: This doesn't seem to be styled as an error notice.
				createErrorNotice(
					__( 'Failed to save settings.', 'farcaster-wp' )
				).then(
					() =>
						document.scrollingElement?.scrollTo( {
							top: 0,
							behavior: 'smooth',
						} )
				);
			} );
	};

	return {
		saveSettings,
		framesEnabled,
		setFramesEnabled,
		splashBackgroundColor,
		setSplashBackgroundColor,
		buttonText,
		setButtonText,
		splashImage,
		setSplashImage,
		fallbackImage,
		setFallbackImage,
		useTitleAsButtonText,
		setUseTitleAsButtonText,
		domainManifest,
		setDomainManifest,
	};
};
