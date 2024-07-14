<?php
/**
 * La configuration de base de votre installation WordPress.
 *
 * Ce fichier contient les réglages de configuration suivants : réglages MySQL,
 * préfixe de table, clés secrètes, langue utilisée, et ABSPATH.
 * Vous pouvez en savoir plus à leur sujet en allant sur
 * {@link https://fr.wordpress.org/support/article/editing-wp-config-php/ Modifier
 * wp-config.php}. C’est votre hébergeur qui doit vous donner vos
 * codes MySQL.
 *
 * Ce fichier est utilisé par le script de création de wp-config.php pendant
 * le processus d’installation. Vous n’avez pas à utiliser le site web, vous
 * pouvez simplement renommer ce fichier en "wp-config.php" et remplir les
 * valeurs.
 *
 * @link https://fr.wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Réglages MySQL - Votre hébergeur doit vous fournir ces informations. ** //
/** Nom de la base de données de WordPress. */
define('WP_CACHE', true);
define( 'WPCACHEHOME', 'C:\MAMP\htdocs\celiaportfolio\wp-content\plugins\wp-super-cache/' );
define( 'DB_NAME', 'celiaportfolio' );

/** Utilisateur de la base de données MySQL. */
define( 'DB_USER', 'root' );

/** Mot de passe de la base de données MySQL. */
define( 'DB_PASSWORD', 'root' );

/** Adresse de l’hébergement MySQL. */
define( 'DB_HOST', 'localhost' );

/** Jeu de caractères à utiliser par la base de données lors de la création des tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** Type de collation de la base de données.
  * N’y touchez que si vous savez ce que vous faites.
  */
define('DB_COLLATE', '');

/**#@+
 * Clés uniques d’authentification et salage.
 *
 * Remplacez les valeurs par défaut par des phrases uniques !
 * Vous pouvez générer des phrases aléatoires en utilisant
 * {@link https://api.wordpress.org/secret-key/1.1/salt/ le service de clés secrètes de WordPress.org}.
 * Vous pouvez modifier ces phrases à n’importe quel moment, afin d’invalider tous les cookies existants.
 * Cela forcera également tous les utilisateurs à se reconnecter.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '^H[]z78QGb**=2{#<,/VV<eD_-YG9}[`5F| )d+RZ]A].55OI/OC;n5N^]XdC|5`' );
define( 'SECURE_AUTH_KEY',  'Et84I@&HA :;PFpmd>8|u{[{PS9je&Vj9j!!K(CHpS<?>%}wiJE3]$KhpTD<GKqk' );
define( 'LOGGED_IN_KEY',    'oXmM()(1x;6[l;gQj`|Y`FZlg5RkaV>p?P1//b<BO5wrM<F<w[-~Z1Yv2QZsRg4e' );
define( 'NONCE_KEY',        'MZ!YukdM(s4=4V H0*DJIsqCr0|v45Nz#p_@7wI}/WeUF{JOu=b5|dmAWS@f_2^l' );
define( 'AUTH_SALT',        'P$6Frh $@[L|hcZ4ax|e-D~`pb}D(;pnzk>-y^}%F`b)=^^%6|{WunKE+gz.M$2=' );
define( 'SECURE_AUTH_SALT', 'lUJ$EH2$H<!.DM:yr*`:<Dt?EVj,C,gV|+.Zmq3Rrr Ed)VihnDTZobgQ:j}t0dJ' );
define( 'LOGGED_IN_SALT',   'bZ,0Ly!sxoxV]7Hv {X*5pXJ+Iw%eVFY`fhOSv(g],*)w}1SZv0-ND5OF]nSxKtx' );
define( 'NONCE_SALT',       'GN=aj.K<JU6%sbH$V$4B*$ql3Tdj[6#mVkFxK$;w(DdGZ8?tfQIdRBn5W<fT-fgz' );
/**#@-*/

/**
 * Préfixe de base de données pour les tables de WordPress.
 *
 * Vous pouvez installer plusieurs WordPress sur une seule base de données
 * si vous leur donnez chacune un préfixe unique.
 * N’utilisez que des chiffres, des lettres non-accentuées, et des caractères soulignés !
 */
$table_prefix = 'wp_';

/**
 * Pour les développeurs et développeuses : le mode déboguage de WordPress.
 *
 * En passant la valeur suivante à "true", vous activez l’affichage des
 * notifications d’erreurs pendant vos essais.
 * Il est fortement recommandé que les développeurs et développeuses d’extensions et
 * de thèmes se servent de WP_DEBUG dans leur environnement de
 * développement.
 *
 * Pour plus d’information sur les autres constantes qui peuvent être utilisées
 * pour le déboguage, rendez-vous sur la documentation.
 *
 * @link https://fr.wordpress.org/support/article/debugging-in-wordpress/
 */
define('WP_DEBUG', false);

/* C’est tout, ne touchez pas à ce qui suit ! Bonne publication. */

/** Chemin absolu vers le dossier de WordPress. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Réglage des variables de WordPress et de ses fichiers inclus. */
require_once(ABSPATH . 'wp-settings.php');
