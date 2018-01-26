<?php

namespace Drupal\poc_graphql_translations\Plugin\GraphQL\Fields;

use Drupal\graphql\Plugin\GraphQL\Fields\FieldPluginBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Youshido\GraphQL\Execution\ResolveInfo;
use Drupal\Core\DependencyInjection\DependencySerializationTrait;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\locale\LocaleTranslation;

/**
 *
 * @GraphQLField(
 *   id = "translation",
 *   secure = true,
 *   name = "translation",
 *   type = "String",
 *   arguments = {
 *     "langcode" = {
 *       "type" = "String"
 *     },
 *     "string" = {
 *       "type" = "String"
 *     },
 *     "context" = {
 *       "type" = "String",
 *       "nullable" = true,
 *       "default" = ""
 *     }
 *   }
 * )
 */
class RootTranslation extends FieldPluginBase implements ContainerFactoryPluginInterface {
  use DependencySerializationTrait;

  /**
   * The locale translation.
   *
   * @var \Drupal\locale\LocaleTranslation
   */
  protected $localeTranslation;

  /**
  * {@inheritdoc}
  */
  public function __construct(
    array $configuration,
    $pluginId,
    $pluginDefinition,
    LocaleTranslation $localeTranslation
  ) {
    $this->localeTranslation = $localeTranslation;
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
      $container->get('string_translator.locale.lookup')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function resolveValues($root, array $args, ResolveInfo $info) {
    yield call_user_func_array([$this->localeTranslation, 'getStringTranslation'], $args);
  }
}
