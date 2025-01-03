import { __ } from '@wordpress/i18n';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalHeading as Heading,
	Button,
	Panel,
	PanelBody,
	PanelRow,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { useSettings } from '../admin-hooks/use-settings';
import { useManifest } from '../admin-hooks/use-manifest';
import { Notices } from './Notices';
import {
	FramesEnabledControl,
	SplashBackgroundColorControl,
	ButtonTextControl,
	ImageUploadControl,
	UseTitleAsButtonTextControl,
	NotificationsEnabledControl,
	DebugEnabledControl,
	TippingEnabledControl,
	TippingAddressControl,
	TippingAmountsControl,
	ChainsControl,
	RPCURLControl,
} from './Controls';
import { ManifestViewer } from './ManifestViewer';
import { SubscriptionsList } from './SubscriptionsList';
import { EventsList } from './EventsList';

const SettingsTitle = () => {
	return (
		<Heading level={ 1 }>
			{ __(
				'Frames Integration for Farcaster Settings',
				'frames-integration-for-farcaster'
			) }
		</Heading>
	);
};

const SaveButton = ( { onClick } ) => {
	return (
		<Button variant="primary" onClick={ onClick } __next40pxDefaultSize>
			{ __( 'Save', 'frames-integration-for-farcaster' ) }
		</Button>
	);
};

const SettingsPage = () => {
	const {
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
		notificationsEnabled,
		setNotificationsEnabled,
		debugEnabled,
		setDebugEnabled,
		tippingEnabled,
		setTippingEnabled,
		tippingAddress,
		setTippingAddress,
		tippingAmounts,
		setTippingAmounts,
		tippingChains,
		setTippingChains,
		rpcURL,
		setRpcURL,
	} = useSettings();

	const { manifest, fetchManifest } = useManifest();

	return (
		<>
			<SettingsTitle />
			<Notices />
			<Panel header="Frames">
				<PanelBody>
					<PanelRow>
						<FramesEnabledControl
							value={ framesEnabled }
							onChange={ ( value ) => setFramesEnabled( value ) }
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody
					title={ __(
						'Frame Button',
						'frames-integration-for-farcaster'
					) }
					initialOpen={ framesEnabled }
				>
					<PanelRow>
						<VStack spacing={ 4 }>
							<UseTitleAsButtonTextControl
								value={ useTitleAsButtonText }
								onChange={ setUseTitleAsButtonText }
							/>
							<ButtonTextControl
								useTitleAsButtonText={ useTitleAsButtonText }
								value={ buttonText }
								onChange={ setButtonText }
							/>
						</VStack>
					</PanelRow>
				</PanelBody>
				<PanelBody
					title={ __(
						'Splash Background Color',
						'frames-integration-for-farcaster'
					) }
					initialOpen={ framesEnabled }
				>
					<PanelRow>
						<SplashBackgroundColorControl
							value={ splashBackgroundColor }
							onChange={ setSplashBackgroundColor }
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody
					title={ __(
						'Frame Splash Image',
						'frames-integration-for-farcaster'
					) }
					initialOpen={ framesEnabled }
				>
					<PanelRow>
						<ImageUploadControl
							value={ splashImage }
							onChange={ setSplashImage }
							labelText={ __(
								'Image will be displayed as 200x200px.',
								'frames-integration-for-farcaster'
							) }
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody
					title={ __(
						'Fallback Frame Image',
						'frames-integration-for-farcaster'
					) }
					initialOpen={ framesEnabled }
				>
					<PanelRow>
						<ImageUploadControl
							labelText={ __(
								'Image will be displayed in 3:2 aspect ratio.',
								'frames-integration-for-farcaster'
							) }
							value={ fallbackImage }
							onChange={ setFallbackImage }
						/>
					</PanelRow>
				</PanelBody>
			</Panel>
			<Panel header="Tipping">
				<PanelBody>
					<PanelRow>
						<TippingEnabledControl
							value={ tippingEnabled }
							onChange={ setTippingEnabled }
						/>
					</PanelRow>
					<PanelRow>
						<TippingAddressControl
							value={ tippingAddress }
							onChange={ setTippingAddress }
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody
					title={ __(
						'Tipping Chains',
						'frames-integration-for-farcaster'
					) }
					initialOpen={ tippingEnabled }
				>
					<PanelRow>
						<ChainsControl
							value={ tippingChains }
							onChange={ setTippingChains }
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody
					title={ __(
						'Tipping Amounts',
						'frames-integration-for-farcaster'
					) }
					initialOpen={ tippingEnabled }
				>
					<PanelRow>
						<TippingAmountsControl
							value={ tippingAmounts }
							onChange={ setTippingAmounts }
						/>
					</PanelRow>
				</PanelBody>
			</Panel>
			<Panel header="Notifications">
				<PanelBody>
					<PanelRow>
						<NotificationsEnabledControl
							value={ notificationsEnabled }
							onChange={ setNotificationsEnabled }
						/>
					</PanelRow>
					<PanelRow>
						<RPCURLControl
							value={ rpcURL }
							onChange={ setRpcURL }
						/>
					</PanelRow>
					<PanelRow>
						<DebugEnabledControl
							value={ debugEnabled }
							onChange={ setDebugEnabled }
						/>
					</PanelRow>
					<PanelRow>
						<SubscriptionsList />
					</PanelRow>
					<PanelRow>
						<EventsList />
					</PanelRow>
				</PanelBody>
			</Panel>
			<Panel header="Manifest">
				<PanelBody
					title={ __(
						'Manifest Validation',
						'frames-integration-for-farcaster'
					) }
				>
					<PanelRow>
						<ManifestViewer
							currentManifest={ manifest }
							domainManifest={ domainManifest }
							setDomainManifest={ setDomainManifest }
						/>
					</PanelRow>
				</PanelBody>
			</Panel>
			<SaveButton onClick={ () => saveSettings( fetchManifest ) } />
		</>
	);
};

export { SettingsPage };
