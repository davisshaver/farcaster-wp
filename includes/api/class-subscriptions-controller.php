<?php
/**
 * Subscriptions API endpoint
 *
 * @package Farcaster_WP\API
 */

namespace Farcaster_WP\API;

use WP_REST_Controller;
use WP_Error;
use WP_REST_Response;
use Farcaster_WP\Notifications;
defined( 'ABSPATH' ) || exit;

/**
 * REST API endpoints for Farcaster subscriptions.
 */
class Subscriptions_Controller extends WP_REST_Controller {

	/**
	 * Endpoint namespace.
	 *
	 * @var string
	 */
	protected $namespace = FARCASTER_WP_API_NAMESPACE;

	/**
	 * Endpoint resource.
	 *
	 * @var string
	 */
	protected $resource_name = 'subscriptions';

	/**
	 * Register the routes.
	 */
	public function register_routes() {
		// Register farcaster-wp/v1/subscriptions endpoint.
		register_rest_route(
			$this->namespace,
			'/' . $this->resource_name,
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_subscriptions' ],
					'permission_callback' => function() {
						return current_user_can( 'manage_options' );
					},
				],
				'schema' => [ $this, 'get_subscriptions_schema' ],
			]
		);
	}

	/**
	 * Get the subscribers.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_subscriptions() {
		$subscriptions      = get_option( Notifications::$notifications_option_name, array() );
		$subscriptions_list = array();
		
		foreach ( $subscriptions as $fid => $subscription ) {
			foreach ( $subscription as $key => $data ) {
				$subscriptions_list[] = array(
					'fid'       => (int) $fid,
					'key'       => $key,
					'url'       => $data['url'],
					'token'     => $data['token'],
					'timestamp' => $data['timestamp'] ?? 'not set',
				);
			}
		}
		
		return new WP_REST_Response( $subscriptions_list );
	}

	/**
	 * Get the REST schema for the endpoints.
	 *
	 * @return array
	 */
	public function get_subscriptions_schema() {
		return [
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => $this->resource_name,
			'type'       => 'object',
			'properties' => [
				'subscriptions' => [
					'type'  => 'array',
					'items' => [
						'type'       => 'object',
						'required'   => [ 'fid', 'token', 'url' ],
						'properties' => [
							'fid'   => [
								'type' => 'integer',
							],
							'token' => [
								'type' => 'string',
							],
							'url'   => [
								'type'   => 'string',
								'format' => 'uri',
							],
						],
					],
				],
			],
		];
	}
}
