<?php

namespace Drupal\poc_graphql_translations\Plugin\GraphQL\Fields;

use Drupal\graphql\Plugin\GraphQL\Fields\FieldPluginBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Youshido\GraphQL\Execution\ResolveInfo;
use Drupal\Core\DependencyInjection\DependencySerializationTrait;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\locale\StringDatabaseStorage;

/**
 *
 * @GraphQLField(
 *   id = "translations",
 *   secure = true,
 *   name = "translations",
 *   type = "Translation",
 *   multi = true,
 *   arguments = {
 *     "language" = {
 *       "type" = "String",
 *       "nullable" = true
 *     },
 *     "context" = {
 *       "type" = "String",
 *       "nullable" = true
 *     },
 *     "translated" = {
 *       "type" = "Boolean",
 *       "nullable" = true,
 *       "default" = true
 *     }
 *   }
 * )
 */
class Translations extends FieldPluginBase implements ContainerFactoryPluginInterface {
  use DependencySerializationTrait;
  /**
   * The locale translation.
   *
   * @var \Drupal\locale\StringDatabaseStorage
   */
  protected $stringDatabaseStorage;

  /**
  * {@inheritdoc}
  */
  public function __construct(
    array $configuration,
    $pluginId,
    $pluginDefinition,
    StringDatabaseStorage $stringDatabaseStorage
  ) {
    $this->stringDatabaseStorage = $stringDatabaseStorage;
    parent::__construct($configuration, $pluginId, $pluginDefinition);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(
    ContainerInterface $container,
    array $configuration,
    $pluginId,
    $pluginDefinition
  ) {
    return new static(
      $configuration,
      $pluginId,
      $pluginDefinition,
      $container->get('locale.storage')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function resolveValues($id, array $args, ResolveInfo $info) {
    $stringInterfaces = $this->stringDatabaseStorage->getTranslations($args, []);

    foreach ($stringInterfaces as $stringInterface) {
      yield $stringInterface->getValues(['language', 'source', 'translation', 'context']);
    }
  }
}
